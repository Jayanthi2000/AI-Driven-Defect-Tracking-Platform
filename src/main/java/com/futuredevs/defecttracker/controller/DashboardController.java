package com.futuredevs.defecttracker.controller;

import com.futuredevs.defecttracker.config.JwtUtil;
import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.model.User;
import com.futuredevs.defecttracker.repository.BugRepository;
import com.futuredevs.defecttracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil JwtUtil;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // Bug Status counts
        stats.put("totalBugs", bugRepository.count());
        stats.put("openBugs", bugRepository.countByStatus(Bug.Status.OPEN));
        stats.put("assignedBugs", bugRepository.countByStatus(Bug.Status.ASSIGNED));
        stats.put("inProgressBugs", bugRepository.countByStatus(Bug.Status.IN_PROGRESS));
        stats.put("fixedBugs", bugRepository.countByStatus(Bug.Status.FIXED));
        stats.put("testingBugs", bugRepository.countByStatus(Bug.Status.TESTING));
        stats.put("closedBugs", bugRepository.countByStatus(Bug.Status.CLOSED));
        stats.put("rejectedBugs", bugRepository.countByStatus(Bug.Status.REJECTED));

        // Severity counts
        stats.put("criticalBugs", bugRepository.countBySeverity(Bug.Severity.CRITICAL));
        stats.put("highBugs", bugRepository.countBySeverity(Bug.Severity.HIGH));
        stats.put("mediumBugs", bugRepository.countBySeverity(Bug.Severity.MEDIUM));
        stats.put("lowBugs", bugRepository.countBySeverity(Bug.Severity.LOW));

        // User counts
        stats.put("totalAdmins", userRepository.findByRole(User.Role.ADMIN).size());
        stats.put("totalDevelopers", userRepository.findByRole(User.Role.DEVELOPER).size());
        stats.put("totalTesters", userRepository.findByRole(User.Role.TESTER).size());

        return ResponseEntity.ok(stats);
    }
}