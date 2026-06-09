package com.futuredevs.defecttracker.controller;

import com.futuredevs.defecttracker.config.JwtUtil;
import com.futuredevs.defecttracker.dto.*;
import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.model.User;
import com.futuredevs.defecttracker.repository.UserRepository;
import com.futuredevs.defecttracker.service.BugService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bugs")
@CrossOrigin(origins = "*")
public class BugController {

    @Autowired
    private BugService bugService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    // Helper — Token-ல இருந்து User எடு
    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    // Bug Create — Tester மட்டும்
    @PostMapping
    public ResponseEntity<Bug> createBug(
            @RequestBody BugRequest request,
            @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        return ResponseEntity.ok(bugService.createBug(request, currentUser));
    }

    // All Bugs
    @GetMapping
    public ResponseEntity<List<Bug>> getAllBugs() {
        return ResponseEntity.ok(bugService.getAllBugs());
    }

    // Single Bug
    @GetMapping("/{id}")
    public ResponseEntity<Bug> getBugById(@PathVariable Long id) {
        return ResponseEntity.ok(bugService.getBugById(id));
    }

    // My Bugs — Role-wise
    @GetMapping("/my-bugs")
    public ResponseEntity<List<Bug>> getMyBugs(
            @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        if (currentUser.getRole() == User.Role.TESTER) {
            return ResponseEntity.ok(bugService.getBugsByTester(currentUser));
        } else if (currentUser.getRole() == User.Role.DEVELOPER) {
            return ResponseEntity.ok(bugService.getBugsByDeveloper(currentUser));
        } else {
            return ResponseEntity.ok(bugService.getBugsByAdmin(currentUser));
        }
    }

    // Assign Bug — Admin மட்டும்
    @PutMapping("/{id}/assign")
    public ResponseEntity<Bug> assignBug(
            @PathVariable Long id,
            @RequestBody BugAssignRequest request,
            @RequestHeader("Authorization") String authHeader) {
        User admin = getCurrentUser(authHeader);
        return ResponseEntity.ok(bugService.assignBug(id, request, admin));
    }

    // Status Update
    @PutMapping("/{id}/status")
    public ResponseEntity<Bug> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request,
            @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        return ResponseEntity.ok(bugService.updateStatus(id, request, currentUser));
    }

    // Delete Bug
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBug(@PathVariable Long id) {
        bugService.deleteBug(id);
        return ResponseEntity.ok("Bug deleted successfully!");
    }
}