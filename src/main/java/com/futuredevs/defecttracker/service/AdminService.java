package com.futuredevs.defecttracker.service;

import com.futuredevs.defecttracker.dto.CreateUserRequest;
import com.futuredevs.defecttracker.exception.BadRequestException;
import com.futuredevs.defecttracker.model.User;
import com.futuredevs.defecttracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    
    public User createUser(CreateUserRequest request, Long adminId) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists!");
        }

        if (request.getRole() == User.Role.ADMIN) {
            throw new BadRequestException("Cannot create Admin from here!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setCreatedBy(adminId);

        userRepository.save(user);

        // Welcome email அனுப்பு
        emailService.sendWelcomeEmail(
                user.getEmail(),
                user.getName(),
                request.getPassword()
        );

        return user;
    }

    
    public List<User> getMyUsers(Long adminId) {
        return userRepository.findByCreatedBy(adminId);
    }

    
    public List<User> getAllDevelopers() {
        return userRepository.findByRole(User.Role.DEVELOPER);
    }

   
    public List<User> getAllTesters() {
        return userRepository.findByRole(User.Role.TESTER);
    }

    
    public List<User> getAllAdmins() {
        return userRepository.findByRole(User.Role.ADMIN);
    }

    
    public String deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        userRepository.delete(user);
        return "User deleted successfully!";
    }

    
    public String deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        user.setActive(false);
        userRepository.save(user);
        return "User deactivated successfully!";
    }
}