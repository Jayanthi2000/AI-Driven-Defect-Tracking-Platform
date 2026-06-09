package com.futuredevs.defecttracker.service;

import com.futuredevs.defecttracker.config.JwtUtil;
import com.futuredevs.defecttracker.dto.AuthResponse;
import com.futuredevs.defecttracker.dto.ForgotPasswordRequest;
import com.futuredevs.defecttracker.dto.LoginRequest;
import com.futuredevs.defecttracker.dto.RegisterRequest;
import com.futuredevs.defecttracker.dto.ResetPasswordRequest;
import com.futuredevs.defecttracker.exception.BadRequestException;
import com.futuredevs.defecttracker.exception.ResourceNotFoundException;
import com.futuredevs.defecttracker.model.User;
import com.futuredevs.defecttracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    // Admin Register மட்டும்
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists!");
        }

        if (request.getRole() != User.Role.ADMIN) {
            throw new BadRequestException(
                "Only Admin can register! " +
                "Developer and Tester accounts are created by Admin.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.ADMIN);

        userRepository.save(user);
        return "Admin registered successfully!";
    }

    // Login
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> 
                    new ResourceNotFoundException("User not found!"));

        // Active check
        if (!user.isActive()) {
            throw new BadRequestException("Account is deactivated!");
        }

        // Password check
        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid password!");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    // Forgot Password
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Email not found!"));

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        try {
            emailService.sendPasswordResetEmail(
                user.getEmail(), resetToken);
        } catch (Exception e) {
            // Email fail ஆனாலும் token save ஆகும்
            System.out.println("Email send failed: " + e.getMessage());
        }

        return "Password reset token generated! Token: " + resetToken;
    }

    // Reset Password
    public String resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> 
                    new BadRequestException("Invalid reset token!"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token expired!");
        }

        user.setPassword(
            passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return "Password reset successfully!";
    }
}