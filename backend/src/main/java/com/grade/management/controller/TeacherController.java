package com.grade.management.controller;

import com.grade.management.entity.Grade;
import com.grade.management.entity.Course;
import com.grade.management.entity.Student;
import com.grade.management.entity.User;
import com.grade.management.service.GradeService;
import com.grade.management.service.CourseService;
import com.grade.management.service.StudentService;
import com.grade.management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {
    
    @Autowired
    private GradeService gradeService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private StudentService studentService;
    
    @Autowired
    private UserService userService;
    
    // 获取教师课程列表
    @GetMapping("/courses")
    public ResponseEntity<?> getTeacherCourses(@RequestAttribute(value = "username", required = false) String username) {
        try {
            if (username == null) {
                username = "teacher"; // 默认用户名
            }
            String teacherName = getCurrentUserName(username);
            List<Course> courses = courseService.findByTeacherName(teacherName);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "获取课程列表失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 获取指定课程的学生列表
    @GetMapping("/courses/{courseName}/students")
    public ResponseEntity<?> getCourseStudents(@PathVariable String courseName, @RequestAttribute(value = "username", required = false) String username) {
        try {
            if (username == null) {
                username = "teacher";
            }
            System.out.println("Getting students for course name: " + courseName);
            List<Student> students = studentService.findByCourseName(courseName);
            System.out.println("Found students: " + students.size());
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "获取学生列表失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 获取指定课程的成绩列表
    @GetMapping("/courses/{courseName}/grades")
    public ResponseEntity<?> getCourseGrades(@PathVariable String courseName, @RequestAttribute(value = "username", required = false) String username) {
        try {
            if (username == null) {
                username = "teacher";
            }
            List<Grade> grades = gradeService.findByCourseName(courseName);
            return ResponseEntity.ok(grades);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "获取成绩列表失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 保存单个成绩
    @PostMapping("/grades")
    public ResponseEntity<?> saveGrade(@RequestBody Grade grade, @RequestAttribute(value = "username", required = false) String username) {
        try {
            if (username == null) {
                username = "teacher";
            }
            // 设置教师姓名
            grade.setTeacherName(getCurrentUserName(username));
            Grade savedGrade = gradeService.save(grade);
            return ResponseEntity.ok(savedGrade);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "保存成绩失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 批量保存成绩
    @PostMapping("/grades/batch")
    public ResponseEntity<?> saveGradesBatch(@RequestBody List<Grade> grades, @RequestAttribute(value = "username", required = false) String username) {
        try {
            if (username == null) {
                username = "teacher";
            }
            String teacherName = getCurrentUserName(username);
            // 为每个成绩设置教师姓名
            for (Grade grade : grades) {
                grade.setTeacherName(teacherName);
            }
            List<Grade> savedGrades = gradeService.saveBatch(grades);
            return ResponseEntity.ok(savedGrades);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "批量保存成绩失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 获取教师的所有成绩
    @GetMapping("/grades")
    public ResponseEntity<?> getTeacherGrades(@RequestAttribute(value = "username", required = false) String username) {
        try {
            if (username == null) {
                username = "teacher";
            }
            List<Grade> grades = gradeService.findByTeacherName(getCurrentUserName(username));
            return ResponseEntity.ok(grades);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "获取成绩列表失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    private String getCurrentUserName(String username) {
        // 根据用户名查询用户信息，返回真实姓名
        User user = userService.findByUsername(username);
        if (user != null) {
            return user.getRealName();
        }
        // 如果找不到用户，返回默认值
        return "张老师";
    }
}