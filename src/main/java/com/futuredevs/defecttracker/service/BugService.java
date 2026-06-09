package com.futuredevs.defecttracker.service;

import com.futuredevs.defecttracker.dto.*;
import com.futuredevs.defecttracker.exception.ResourceNotFoundException;
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

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    
    public Bug createBug(BugRequest request, User currentUser) {
        
        User admin = userRepository.findById(request.getAssignedAdminId())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found!"));

        Bug bug = new Bug();
        bug.setTitle(request.getTitle());
        bug.setDescription(request.getDescription());
        bug.setReportedBy(currentUser);
        bug.setAssignedAdmin(admin);
        bug.setSeverity(Bug.Severity.MEDIUM);
        bug.setCategory(Bug.Category.OTHER);

        Bug savedBug = bugRepository.save(bug);

        
        notificationService.createNotification(
                admin, savedBug,
                "New bug reported by " + currentUser.getName() + ": " + bug.getTitle()
        );

        
        emailService.sendBugNotificationEmail(
                admin.getEmail(),
                admin.getName(),
                bug.getTitle(),
                "A new bug has been reported by " + currentUser.getName()
        );

        return savedBug;
    }

    
    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    
    public Bug getBugById(Long id) {
        return bugRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bug not found!"));
    }

    
    public Bug assignBug(Long bugId, BugAssignRequest request, User admin) {
        Bug bug = getBugById(bugId);

        User developer = userRepository.findById(request.getAssignedToUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Developer not found!"));

        bug.setAssignedTo(developer);
        bug.setStatus(Bug.Status.ASSIGNED);

        Bug savedBug = bugRepository.save(bug);

        
        notificationService.createNotification(
                developer, savedBug,
                "Bug assigned to you by " + admin.getName() + ": " + bug.getTitle()
        );

       
        emailService.sendBugNotificationEmail(
                developer.getEmail(),
                developer.getName(),
                bug.getTitle(),
                "A bug has been assigned to you by Admin " + admin.getName()
        );

        return savedBug;
    }

    
    public Bug updateStatus(Long bugId, StatusUpdateRequest request, User currentUser) {
        Bug bug = getBugById(bugId);
        bug.setStatus(request.getStatus());
        Bug savedBug = bugRepository.save(bug);

        
        if (bug.getReportedBy() != null) {
            notificationService.createNotification(
                    bug.getReportedBy(), savedBug,
                    "Bug status updated to " + request.getStatus() + ": " + bug.getTitle()
            );
        }

        return savedBug;
    }

    
    public void deleteBug(Long bugId) {
        bugRepository.deleteById(bugId);
    }

    
    public Bug saveAiResult(Long bugId, String severity,
                             String category, String suggestion) {
        Bug bug = getBugById(bugId);
        bug.setSeverity(Bug.Severity.valueOf(severity));
        bug.setCategory(Bug.Category.valueOf(category));
        bug.setAiSuggestion(suggestion);
        return bugRepository.save(bug);
    }

    
    public List<Bug> getBugsByAdmin(User admin) {
        return bugRepository.findByAssignedAdmin(admin);
    }

    
    public List<Bug> getBugsByDeveloper(User developer) {
        return bugRepository.findByAssignedTo(developer);
    }

    
    public List<Bug> getBugsByTester(User tester) {
        return bugRepository.findByReportedBy(tester);
    }
}