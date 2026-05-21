package com.futuredevs.defecttracker.controller;

import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.repository.BugRepository;
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

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        // Status wise count
        stats.put("totalBugs", bugRepository.count());
        stats.put("openBugs", bugRepository.countByStatus(Bug.Status.OPEN));
        stats.put("inProgressBugs", bugRepository.countByStatus(Bug.Status.IN_PROGRESS));
        stats.put("resolvedBugs", bugRepository.countByStatus(Bug.Status.RESOLVED));
        stats.put("closedBugs", bugRepository.countByStatus(Bug.Status.CLOSED));

        // Severity wise count
        stats.put("criticalBugs", bugRepository.countBySeverity(Bug.Severity.CRITICAL));
        stats.put("highBugs", bugRepository.countBySeverity(Bug.Severity.HIGH));
        stats.put("mediumBugs", bugRepository.countBySeverity(Bug.Severity.MEDIUM));
        stats.put("lowBugs", bugRepository.countBySeverity(Bug.Severity.LOW));

        return ResponseEntity.ok(stats);
    }
}