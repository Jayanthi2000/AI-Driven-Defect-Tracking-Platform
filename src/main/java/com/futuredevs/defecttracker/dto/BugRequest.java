package com.futuredevs.defecttracker.dto;

public class BugRequest {
    private String title;
    private String description;
    private Long assignedAdminId;

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Long getAssignedAdminId() { return assignedAdminId; }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setAssignedAdminId(Long assignedAdminId) { this.assignedAdminId = assignedAdminId; }
}