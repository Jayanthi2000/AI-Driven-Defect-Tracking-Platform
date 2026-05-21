package com.futuredevs.defecttracker.controller;

import com.futuredevs.defecttracker.dto.*;
import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.model.User;
import com.futuredevs.defecttracker.service.BugService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bugs")
@CrossOrigin(origins = "*")
public class BugController {

    @Autowired
    private BugService bugService;

    // Bug Create
    @PostMapping
    public ResponseEntity<Bug> createBug(
            @RequestBody BugRequest request,
            @AuthenticationPrincipal User currentUser) {
        Bug bug = bugService.createBug(request, currentUser);
        return ResponseEntity.ok(bug);
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

    // Assign Bug
    @PutMapping("/{id}/assign")
    public ResponseEntity<Bug> assignBug(
            @PathVariable Long id,
            @RequestBody BugAssignRequest request) {
        return ResponseEntity.ok(bugService.assignBug(id, request));
    }

    // Status Update
    @PutMapping("/{id}/status")
    public ResponseEntity<Bug> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(bugService.updateStatus(id, request));
    }

    // Delete Bug
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBug(@PathVariable Long id) {
        bugService.deleteBug(id);
        return ResponseEntity.ok("Bug deleted successfully!");
    }
}