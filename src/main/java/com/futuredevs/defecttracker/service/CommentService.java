package com.futuredevs.defecttracker.service;

import com.futuredevs.defecttracker.dto.CommentRequest;
import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.model.Comment;
import com.futuredevs.defecttracker.model.User;
import com.futuredevs.defecttracker.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private BugService bugService;

    // Comment Add
    public Comment addComment(Long bugId, CommentRequest request, User currentUser) {
        Bug bug = bugService.getBugById(bugId);
        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setBug(bug);
        comment.setUser(currentUser);
        return commentRepository.save(comment);
    }

    // Bug-ல உள்ள Comments எல்லாம் Get
    public List<Comment> getCommentsByBug(Long bugId) {
        Bug bug = bugService.getBugById(bugId);
        return commentRepository.findByBug(bug);
    }
}