package com.futuredevs.defecttracker.controller;

import com.futuredevs.defecttracker.config.JwtUtil;
import com.futuredevs.defecttracker.dto.CreateUserRequest;
import com.futuredevs.defecttracker.model.User;
import com.futuredevs.defecttracker.repository.UserRepository;
import com.futuredevs.defecttracker.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

   
    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    // Admin creates Developer or Tester
    @PostMapping("/users")
    public ResponseEntity<User> createUser(
            @RequestBody CreateUserRequest request,
            @RequestHeader("Authorization") String authHeader) {
        User admin = getCurrentUser(authHeader);
        return ResponseEntity.ok(adminService.createUser(request, admin.getId()));
    }

    // Admin-ஓட Users List
    @GetMapping("/users")
    public ResponseEntity<List<User>> getMyUsers(
            @RequestHeader("Authorization") String authHeader) {
        User admin = getCurrentUser(authHeader);
        return ResponseEntity.ok(adminService.getMyUsers(admin.getId()));
    }

    // All Developers
    @GetMapping("/developers")
    public ResponseEntity<List<User>> getAllDevelopers() {
        return ResponseEntity.ok(adminService.getAllDevelopers());
    }

    // All Testers
    @GetMapping("/testers")
    public ResponseEntity<List<User>> getAllTesters() {
        return ResponseEntity.ok(adminService.getAllTesters());
    }

    // All Admins
    @GetMapping("/admins")
    public ResponseEntity<List<User>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    // User Delete
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deleteUser(id));
    }

    // User Deactivate
    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deactivateUser(id));
    }
}