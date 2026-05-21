package com.futuredevs.defecttracker.dto;

public class BugAssignRequest {
    private Long assignedToUserId;

    public Long getAssignedToUserId() { return assignedToUserId; }
    public void setAssignedToUserId(Long assignedToUserId) { 
        this.assignedToUserId = assignedToUserId; 
    }
}