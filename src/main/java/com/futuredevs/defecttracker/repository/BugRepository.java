package com.futuredevs.defecttracker.repository;

import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BugRepository extends JpaRepository<Bug, Long> {

    List<Bug> findByReportedBy(User user);
    List<Bug> findByAssignedTo(User user);
    List<Bug> findByStatus(Bug.Status status);
    List<Bug> findBySeverity(Bug.Severity severity);
    long countByStatus(Bug.Status status);
    long countBySeverity(Bug.Severity severity);
}