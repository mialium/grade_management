package com.grade.management.service;

import com.grade.management.entity.User;
import com.grade.management.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Date;

@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User findByUsername(String username) {
        return userMapper.findByUsername(username);
    }
    
    public User findByEmail(String email) {
        return userMapper.findByEmail(email);
    }
    
    public User findByVerificationToken(String token) {
        return userMapper.findByVerificationToken(token);
    }
    
    public User findById(Long id) {
        return userMapper.findById(id);
    }
    
    public List<User> findAll() {
        return userMapper.findAll();
    }
    
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setIsActive(true);
        userMapper.insert(user);
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