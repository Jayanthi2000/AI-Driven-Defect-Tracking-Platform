package com.futuredevs.defecttracker.dto;

import com.futuredevs.defecttracker.model.Bug;

public class StatusUpdateRequest {
    private Bug.Status status;

    public Bug.Status getStatus() { return status; }
    public void setStatus(Bug.Status status) { this.status = status; }
}