package com.futuredevs.defecttracker.ai;

public class AiAnalysisResult {

    private String severity;
    private String category;
    private String suggestion;
    private boolean isDuplicate;

    public AiAnalysisResult() {}

    public String getSeverity() { return severity; }
    public String getCategory() { return category; }
    public String getSuggestion() { return suggestion; }
    public boolean isDuplicate() { return isDuplicate; }

    public void setSeverity(String severity) { this.severity = severity; }
    public void setCategory(String category) { this.category = category; }
    public void setSuggestion(String suggestion) { this.suggestion = suggestion; }
    public void setDuplicate(boolean duplicate) { isDuplicate = duplicate; }
}