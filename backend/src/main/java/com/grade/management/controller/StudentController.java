package com.grade.management.controller;

import com.grade.management.entity.Grade;
import com.grade.management.entity.Student;
import com.grade.management.service.GradeService;
import com.grade.management.service.StudentService;
import com.grade.management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {
    
    @Autowired
    private GradeService gradeService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/grades")
    public ResponseEntity<?> getMyGrades(@RequestAttribute(value = "username", required = false) String username) {
        try {
            if (username == null) {
                username = "student1"; // 默认学生用户名
            }
            
            // 通过用户名查找用户，获取真实姓名
            com.grade.management.entity.User user = userService.findByUsername(username);
            String studentName = user != null ? user.getRealName() : username;
            
            List<Grade> grades = gradeService.findByStudentName(studentName);
            return ResponseEntity.ok(grades);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("获取成绩失败: " + e.getMessage());
        }
    }
    
    private Long getCurrentUserId(String username) {
        return 1L;
    }
}