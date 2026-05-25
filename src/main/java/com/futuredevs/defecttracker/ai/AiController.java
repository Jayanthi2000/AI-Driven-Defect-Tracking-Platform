package com.futuredevs.defecttracker.ai;

import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.service.BugService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private AiService aiService;

    @Autowired
    private BugService bugService;

    @PostMapping("/analyze/{bugId}")
    public ResponseEntity<Bug> analyzeBug(@PathVariable Long bugId) {

        
        Bug bug = bugService.getBugById(bugId);

        
        String aiResponse = aiService.analyzeBug(bug.getDescription());

        // Parse AI Response
        String severity = "MEDIUM";
        String category = "OTHER";
        String suggestion = "";

        for (String line : aiResponse.split("\n")) {
            if (line.startsWith("SEVERITY:")) {
                severity = line.replace("SEVERITY:", "").trim();
            } else if (line.startsWith("CATEGORY:")) {
                category = line.replace("CATEGORY:", "").trim();
            } else if (line.startsWith("SUGGESTION:")) {
                suggestion = line.replace("SUGGESTION:", "").trim();
            }
        }

       
        Bug updatedBug = bugService.saveAiResult(bugId, severity, category, suggestion);
        return ResponseEntity.ok(updatedBug);
    }
}