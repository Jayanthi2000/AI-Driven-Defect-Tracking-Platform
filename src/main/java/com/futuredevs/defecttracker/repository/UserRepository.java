package com.futuredevs.defecttracker.repository;

import com.futuredevs.defecttracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(User.Role role);
    List<User> findByCreatedBy(Long adminId);
    Optional<User> findByResetToken(String resetToken);
}