package com.quitq.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.quitq.dto.ResetPasswordDTO;
import com.quitq.entity.User;
import com.quitq.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository repository;

    @PostMapping("/register")
    public User register(@RequestBody User user){
        return repository.save(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user){

        User dbUser = repository.findByUsername(user.getUsername());

        if(dbUser != null && dbUser.getPassword().equals(user.getPassword())){
            return "Login Successful";
        }

        return "Invalid Credentials";
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        try {
            User user = repository.findByEmail(resetPasswordDTO.getEmail());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User not found");
            }

            // Verify security answers (case-insensitive)
            String storedAnswer1 = user.getSecurityAnswer1() != null ? user.getSecurityAnswer1().toLowerCase().trim() : "";
            String storedAnswer2 = user.getSecurityAnswer2() != null ? user.getSecurityAnswer2().toLowerCase().trim() : "";
            String providedAnswer1 = resetPasswordDTO.getSecurityAnswer1() != null ? resetPasswordDTO.getSecurityAnswer1().toLowerCase().trim() : "";
            String providedAnswer2 = resetPasswordDTO.getSecurityAnswer2() != null ? resetPasswordDTO.getSecurityAnswer2().toLowerCase().trim() : "";

            if (!storedAnswer1.equals(providedAnswer1) || !storedAnswer2.equals(providedAnswer2)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Security answers do not match");
            }

            // Update password
            user.setPassword(resetPasswordDTO.getNewPassword());
            repository.save(user);

            return ResponseEntity.ok("Password reset successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Password reset failed: " + e.getMessage());
        }
    }
}