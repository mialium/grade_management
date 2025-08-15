package com.grade.management.service;

import com.grade.management.entity.User;
import com.grade.management.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Date;

@Slf4j
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User findByUsername(String username) {
        log.debug("Finding user by username: {}", username);
        return userMapper.findByUsername(username);
    }
    
    public User findByEmail(String email) {
        log.debug("Finding user by email: {}", email);
        return userMapper.findByEmail(email);
    }
    
    public User findByVerificationToken(String token) {
        log.debug("Finding user by verification token: {}", token);
        return userMapper.findByVerificationToken(token);
    }
    
    public User findById(Long id) {
        log.debug("Finding user by id: {}", id);
        return userMapper.findById(id);
    }
    
    public List<User> findAll() {
        log.debug("Finding all users");
        return userMapper.findAll();
    }
    
    public User register(User user) {
        log.info("Registering new user: {}", user.getUsername());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setIsActive(true);
        userMapper.insert(user);
        log.info("User registered successfully: {}", user.getUsername());
        return user;
    }
    
    public User registerWithEmailVerification(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setIsActive(true);
        user.setIsEmailVerified(false);
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());
        userMapper.insert(user);
        return user;
    }
    
    public void verifyEmail(Long userId) {
        User user = findById(userId);
        if (user != null) {
            user.setIsEmailVerified(true);
            user.setEmailVerificationToken(null);
            user.setEmailVerificationExpires(null);
            user.setUpdatedAt(new Date());
            update(user);
        }
    }
    
    public void update(User user) {
        user.setUpdatedAt(new Date());
        userMapper.update(user);
    }
    
    public void delete(Long id) {
        userMapper.delete(id);
    }
    
    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}