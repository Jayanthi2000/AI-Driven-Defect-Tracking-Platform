package com.futuredevs.defecttracker.controller;

import com.futuredevs.defecttracker.config.JwtUtil;
import com.futuredevs.defecttracker.model.Notification;
import com.futuredevs.defecttracker.model.User;
import com.futuredevs.defecttracker.repository.UserRepository;
import com.futuredevs.defecttracker.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

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

    // My Notifications
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(
            @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        return ResponseEntity.ok(
                notificationService.getUserNotifications(currentUser.getId()));
    }

    // Unread Count
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        return ResponseEntity.ok(
                notificationService.getUnreadCount(currentUser.getId()));
    }

    // Mark as Read
    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok("Marked as read!");
    }

    // Mark All as Read
    @PutMapping("/read-all")
    public ResponseEntity<String> markAllAsRead(
            @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        notificationService.markAllAsRead(currentUser.getId());
        return ResponseEntity.ok("All marked as read!");
    }
}