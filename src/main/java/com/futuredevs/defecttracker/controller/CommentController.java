package com.futuredevs.defecttracker.controller;

import com.futuredevs.defecttracker.config.JwtUtil;
import com.futuredevs.defecttracker.dto.CommentRequest;
import com.futuredevs.defecttracker.model.Comment;
import com.futuredevs.defecttracker.model.User;
import com.futuredevs.defecttracker.repository.UserRepository;
import com.futuredevs.defecttracker.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

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

    @PostMapping("/bugs/{bugId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long bugId,
            @RequestBody CommentRequest request,
            @RequestHeader("Authorization") String authHeader) {
        User currentUser = getCurrentUser(authHeader);
        return ResponseEntity.ok(
                commentService.addComment(bugId, request, currentUser));
    }

    @GetMapping("/bugs/{bugId}/comments")
    public ResponseEntity<List<Comment>> getComments(
            @PathVariable Long bugId) {
        return ResponseEntity.ok(commentService.getCommentsByBug(bugId));
    }
}