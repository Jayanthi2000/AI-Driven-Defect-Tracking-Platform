package com.futuredevs.defecttracker.repository;

import com.futuredevs.defecttracker.model.Comment;
import com.futuredevs.defecttracker.model.Bug;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByBug(Bug bug);
}