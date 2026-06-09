package com.futuredevs.defecttracker.repository;

import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByBug(Bug bug);
}