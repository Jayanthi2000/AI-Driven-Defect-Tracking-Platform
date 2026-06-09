package com.futuredevs.defecttracker.service;

import com.futuredevs.defecttracker.model.Bug;
import com.futuredevs.defecttracker.model.Notification;
import com.futuredevs.defecttracker.model.User;
import com.futuredevs.defecttracker.repository.NotificationRepository;
import com.futuredevs.defecttracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    // Notification Create பண்ணு
    public void createNotification(User user, Bug bug, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setBug(bug);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    // User-ல உள்ள எல்லா Notifications
    public List<Notification> getUserNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // Unread Notifications Count
    public long getUnreadCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return notificationRepository.countByUserAndIsRead(user, false);
    }

    // Mark as Read
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found!"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    // Mark All as Read
    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        List<Notification> notifications = notificationRepository
                .findByUserAndIsRead(user, false);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}