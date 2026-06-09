package com.futuredevs.defecttracker.service;

import com.futuredevs.defecttracker.dto.CommentRequest;
import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.model.Comment;
import com.futuredevs.defecttracker.model.User;
import com.futuredevs.defecttracker.repository.BugRepository;
import com.futuredevs.defecttracker.repository.CommentRepository;
import com.futuredevs.defecttracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private BugRepository bugRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment addComment(Long bugId, CommentRequest request, User currentUser) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new RuntimeException("Bug not found!"));

        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setBug(bug);
        comment.setUser(user);

        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByBug(Long bugId) {
        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new RuntimeException("Bug not found!"));
        return commentRepository.findByBug(bug);
    }
}