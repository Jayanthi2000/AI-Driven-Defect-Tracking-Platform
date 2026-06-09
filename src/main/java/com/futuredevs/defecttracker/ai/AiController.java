package com.futuredevs.defecttracker.ai;

import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.service.BugService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private AiService aiService;

    @Autowired
    private BugService bugService;

    // Bug Analyze பண்ணு
    @PostMapping("/analyze/{bugId}")
    public ResponseEntity<Map<String, Object>> analyzeBug(
            @PathVariable Long bugId) {

        // Bug fetch பண்ணு
        Bug bug = bugService.getBugById(bugId);

        // AI Analyze பண்ணு
        AiAnalysisResult result = aiService.analyzeBug(
                bug.getTitle(),
                bug.getDescription()
        );

        // DB-ல Save பண்ணு
        bugService.saveAiResult(
                bugId,
                result.getSeverity(),
                result.getCategory(),
                result.getSuggestion()
        );

        // Response return பண்ணு
        Map<String, Object> response = new HashMap<>();
        response.put("bugId", bugId);
        response.put("severity", result.getSeverity());
        response.put("category", result.getCategory());
        response.put("suggestion", result.getSuggestion());
        response.put("isDuplicate", result.isDuplicate());
        response.put("message", "AI Analysis Complete!");

        return ResponseEntity.ok(response);
    }

    // Quick Analyze — Bug submit பண்ணும்போதே analyze பண்ணு
    @PostMapping("/quick-analyze")
    public ResponseEntity<AiAnalysisResult> quickAnalyze(
            @RequestBody Map<String, String> request) {

        String title = request.get("title");
        String description = request.get("description");

        AiAnalysisResult result = aiService.analyzeBug(title, description);
        return ResponseEntity.ok(result);
    }

    // Duplicate Check மட்டும்
    @PostMapping("/duplicate-check")
    public ResponseEntity<Map<String, Object>> checkDuplicate(
            @RequestBody Map<String, String> request) {

        String description = request.get("description");
        boolean isDuplicate = aiService.checkDuplicate(description);

        Map<String, Object> response = new HashMap<>();
        response.put("isDuplicate", isDuplicate);
        response.put("message", isDuplicate ?
                "Potential duplicate bug detected!" :
                "No duplicate found.");

        return ResponseEntity.ok(response);
    }
}