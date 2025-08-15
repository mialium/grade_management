package com.grade.management.controller;

import com.grade.management.entity.Grade;
import com.grade.management.entity.User;
import com.grade.management.service.GradeService;
import com.grade.management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private GradeService gradeService;
    
    @Autowired
    private UserService userService;
    
    // 用户管理API
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        log.info("Admin request: get all users");
        List<User> users = userService.findAll();
        log.debug("Retrieved {} users", users.size());
        return ResponseEntity.ok(users);
    }
    
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        log.info("Admin request: create user - {}", user.getUsername());
        if (userService.findByUsername(user.getUsername()) != null) {
            log.warn("Admin create user failed: username already exists - {}", user.getUsername());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "用户名已存在");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        
        User createdUser = userService.register(user);
        log.info("Admin created user successfully: {}", createdUser.getUsername());
        return ResponseEntity.ok(createdUser);
    }
    
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long userId, @RequestBody Map<String, Boolean> request) {
        log.info("Admin request: update user status - userId: {}, active: {}", userId, request.get("active"));
        User user = userService.findById(userId);
        if (user == null) {
            log.warn("Admin update user status failed: user not found - userId: {}", userId);
            return ResponseEntity.notFound().build();
        }
        
        user.setIsActive(request.get("isActive"));
        userService.update(user);
        Map<String, String> successResponse = new HashMap<>();
        successResponse.put("message", "状态更新成功");
        return ResponseEntity.ok(successResponse);
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        if (userService.findById(userId) == null) {
            return ResponseEntity.notFound().build();
        }
        
        userService.delete(userId);
        Map<String, String> deleteResponse = new HashMap<>();
        deleteResponse.put("message", "用户删除成功");
        return ResponseEntity.ok(deleteResponse);
    }
    
    // 成绩管理API
    @GetMapping("/grades")
    public ResponseEntity<?> getAllGrades() {
        List<Grade> grades = gradeService.findAll();
        return ResponseEntity.ok(grades);
    }
    
    @PostMapping("/grades")
    public ResponseEntity<?> addGrade(@RequestBody Grade grade) {
        Grade savedGrade = gradeService.save(grade);
        return ResponseEntity.ok(savedGrade);
    }
    
    @PutMapping("/grades/{id}")
    public ResponseEntity<?> updateGrade(@PathVariable Long id, @RequestBody Grade grade) {
        grade.setId(id);
        Grade updatedGrade = gradeService.save(grade);
        return ResponseEntity.ok(updatedGrade);
    }
    
    @DeleteMapping("/grades/{id}")
    public ResponseEntity<?> deleteGrade(@PathVariable Long id) {
        gradeService.delete(id);
        return ResponseEntity.ok("删除成功");
    }
}