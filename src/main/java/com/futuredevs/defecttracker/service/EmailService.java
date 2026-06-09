package com.futuredevs.defecttracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String to, String name, String password) {
        String subject = "Welcome to AI Defect Tracker!";
        String body = "Hello " + name + ",\n\n" +
                "Your account has been created successfully.\n\n" +
                "Email: " + to + "\n" +
                "Password: " + password + "\n\n" +
                "Please login at: http://localhost:3000\n\n" +
                "Team Future Devs";
        sendEmail(to, subject, body);
    }

    public void sendPasswordResetEmail(String to, String resetToken) {
        String subject = "Password Reset Request";
        String body = "Hello,\n\n" +
                "Click the link below to reset your password:\n\n" +
                "http://localhost:3000/reset-password?token=" + resetToken + "\n\n" +
                "This link expires in 1 hour.\n\n" +
                "If you did not request this, ignore this email.\n\n" +
                "Team Future Devs";
        sendEmail(to, subject, body);
    }

    public void sendBugNotificationEmail(String to, String name, String bugTitle, String message) {
        String subject = "Bug Notification: " + bugTitle;
        String body = "Hello " + name + ",\n\n" +
                message + "\n\n" +
                "Bug Title: " + bugTitle + "\n\n" +
                "Login to view details: http://localhost:3000\n\n" +
                "Team Future Devs";
        sendEmail(to, subject, body);
    }
}