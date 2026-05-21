package com.futuredevs.defecttracker.service;

import com.futuredevs.defecttracker.dto.*;
import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.model.User;
import com.futuredevs.defecttracker.repository.BugRepository;
import com.futuredevs.defecttracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BugService {

    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private UserRepository userRepository;

    // Bug Create
    public Bug createBug(BugRequest request, User currentUser) {
        Bug bug = new Bug();
        bug.setTitle(request.getTitle());
        bug.setDescription(request.getDescription());
        bug.setReportedBy(currentUser);
        bug.setSeverity(Bug.Severity.MEDIUM);
        bug.setCategory(Bug.Category.OTHER);
        return bugRepository.save(bug);
    }

    // All Bugs Get
    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    // Single Bug Get
    public Bug getBugById(Long id) {
        return bugRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bug not found!"));
    }

    // Bug Assign
    public Bug assignBug(Long bugId, BugAssignRequest request) {
        Bug bug = getBugById(bugId);
        User developer = userRepository.findById(request.getAssignedToUserId())
                .orElseThrow(() -> new RuntimeException("User not found!"));
        bug.setAssignedTo(developer);
        bug.setStatus(Bug.Status.IN_PROGRESS);
        return bugRepository.save(bug);
    }

    // Status Update
    public Bug updateStatus(Long bugId, StatusUpdateRequest request) {
        Bug bug = getBugById(bugId);
        bug.setStatus(request.getStatus());
        return bugRepository.save(bug);
    }

    // Bug Delete
    public void deleteBug(Long bugId) {
        bugRepository.deleteById(bugId);
    }

    // AI Result Save
    public Bug saveAiResult(Long bugId, String severity,
                             String category, String suggestion) {
        Bug bug = getBugById(bugId);
        bug.setSeverity(Bug.Severity.valueOf(severity));
        bug.setCategory(Bug.Category.valueOf(category));
        bug.setAiSuggestion(suggestion);
        return bugRepository.save(bug);
    }
}