package com.futuredevs.defecttracker.ai;

import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.repository.BugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiService {

    // OpenAI key தேவையில்ல — Rule Based AI
    @Autowired
    private BugRepository bugRepository;

    // Bug Analyze பண்ணு
    public AiAnalysisResult analyzeBug(String title, String description) {
        AiAnalysisResult result = new AiAnalysisResult();

        String desc = (description + " " + title).toLowerCase();

        // Severity Prediction
        if (desc.contains("crash") || desc.contains("error") ||
            desc.contains("down") || desc.contains("critical")) {
            result.setSeverity("CRITICAL");
        } else if (desc.contains("fail") || desc.contains("wrong") ||
                   desc.contains("broken") || desc.contains("not working")) {
            result.setSeverity("HIGH");
        } else if (desc.contains("slow") || desc.contains("issue") ||
                   desc.contains("problem") || desc.contains("incorrect")) {
            result.setSeverity("MEDIUM");
        } else {
            result.setSeverity("LOW");
        }

        // Category Detection
        if (desc.contains("login") || desc.contains("password") ||
            desc.contains("auth") || desc.contains("token")) {
            result.setCategory("AUTHENTICATION");
        } else if (desc.contains("button") || desc.contains("page") ||
                   desc.contains("ui") || desc.contains("screen") ||
                   desc.contains("display") || desc.contains("layout")) {
            result.setCategory("UI");
        } else if (desc.contains("api") || desc.contains("endpoint") ||
                   desc.contains("request") || desc.contains("response")) {
            result.setCategory("API");
        } else if (desc.contains("database") || desc.contains("db") ||
                   desc.contains("query") || desc.contains("data")) {
            result.setCategory("DATABASE");
        } else if (desc.contains("slow") || desc.contains("performance") ||
                   desc.contains("load") || desc.contains("timeout")) {
            result.setCategory("PERFORMANCE");
        } else {
            result.setCategory("OTHER");
        }

        // Fix Suggestion
        if (result.getCategory().equals("AUTHENTICATION")) {
            result.setSuggestion("Check JWT token validation and session management.");
        } else if (result.getCategory().equals("UI")) {
            result.setSuggestion("Inspect the component rendering and CSS styles.");
        } else if (result.getCategory().equals("API")) {
            result.setSuggestion("Verify API endpoint URL, request headers and response handling.");
        } else if (result.getCategory().equals("DATABASE")) {
            result.setSuggestion("Check database connection, query syntax and data integrity.");
        } else if (result.getCategory().equals("PERFORMANCE")) {
            result.setSuggestion("Optimize queries, add caching and check server resources.");
        } else {
            result.setSuggestion("Review logs and debug step by step.");
        }

        // Duplicate Detection
        result.setDuplicate(checkDuplicate(description));

        return result;
    }

    // Duplicate Check
    public boolean checkDuplicate(String description) {
        List<Bug> existingBugs = bugRepository.findAll();

        for (Bug bug : existingBugs) {
            if (bug.getDescription() != null) {
                String existing = bug.getDescription().toLowerCase();
                String newDesc = description.toLowerCase();

                String[] words = newDesc.split(" ");
                int matchCount = 0;
                for (String word : words) {
                    if (word.length() > 3 && existing.contains(word)) {
                        matchCount++;
                    }
                }

                double similarity = (double) matchCount / words.length;
                if (similarity > 0.5) {
                    return true;
                }
            }
        }
        return false;
    }
}