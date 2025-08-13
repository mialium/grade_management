package com.grade.management.controller;

import com.grade.management.entity.User;
import com.grade.management.mapper.UserMapper;
import com.grade.management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class DatabaseTestController {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/db-connection")
    public ResponseEntity<Map<String, Object>> testDatabaseConnection() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 测试数据库连接
            User admin = userMapper.findByUsername("admin");
            
            if (admin != null) {
                result.put("status", "success");
                result.put("message", "数据库连接正常");
                Map<String, Object> adminUserMap = new HashMap<>();
                adminUserMap.put("id", admin.getId());
                adminUserMap.put("username", admin.getUsername());
                adminUserMap.put("realName", admin.getRealName());
                adminUserMap.put("role", admin.getRole());
                adminUserMap.put("isActive", admin.getIsActive());
                result.put("adminUser", adminUserMap);
            } else {
                result.put("status", "error");
                result.put("message", "未找到admin用户，数据库可能未初始化");
            }
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "数据库连接失败: " + e.getMessage());
        }
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            User admin = userMapper.findByUsername("admin");
            User teacher1 = userMapper.findByUsername("teacher1");
            User student1 = userMapper.findByUsername("student1");
            
            result.put("status", "success");
            Map<String, Object> usersMap = new HashMap<>();
            
            Map<String, Object> adminMap = null;
            if (admin != null) {
                adminMap = new HashMap<>();
                adminMap.put("id", admin.getId());
                adminMap.put("username", admin.getUsername());
                adminMap.put("realName", admin.getRealName());
                adminMap.put("role", admin.getRole());
                adminMap.put("isActive", admin.getIsActive());
            }
            usersMap.put("admin", adminMap);
            
            Map<String, Object> teacher1Map = null;
            if (teacher1 != null) {
                teacher1Map = new HashMap<>();
                teacher1Map.put("id", teacher1.getId());
                teacher1Map.put("username", teacher1.getUsername());
                teacher1Map.put("realName", teacher1.getRealName());
                teacher1Map.put("role", teacher1.getRole());
                teacher1Map.put("isActive", teacher1.getIsActive());
            }
            usersMap.put("teacher1", teacher1Map);
            
            Map<String, Object> student1Map = null;
            if (student1 != null) {
                student1Map = new HashMap<>();
                student1Map.put("id", student1.getId());
                student1Map.put("username", student1.getUsername());
                student1Map.put("realName", student1.getRealName());
                student1Map.put("role", student1.getRole());
                student1Map.put("isActive", student1.getIsActive());
            }
            usersMap.put("student1", student1Map);
            
            result.put("users", usersMap);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "查询用户失败: " + e.getMessage());
        }
        
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/test-password")
    public ResponseEntity<Map<String, Object>> testPassword(@RequestBody Map<String, String> request) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String username = request.get("username");
            String password = request.get("password");
            
            User user = userMapper.findByUsername(username);
            
            if (user == null) {
                result.put("status", "error");
                result.put("message", "用户不存在: " + username);
            } else {
                boolean passwordValid = userService.validatePassword(password, user.getPassword());
                
                result.put("status", "success");
                result.put("username", username);
                result.put("passwordValid", passwordValid);
                result.put("storedHash", user.getPassword());
                
                if (passwordValid) {
                    result.put("message", "密码验证成功");
                } else {
                    result.put("message", "密码验证失败");
                }
            }
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "密码测试失败: " + e.getMessage());
        }
        
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/test-login")
    public ResponseEntity<Map<String, Object>> testLogin(@RequestBody Map<String, String> request) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String username = request.get("username");
            String password = request.get("password");
            
            User user = userMapper.findByUsername(username);
            
            if (user == null) {
                result.put("status", "error");
                result.put("message", "用户名或密码错误");
            } else if (!userService.validatePassword(password, user.getPassword())) {
                result.put("status", "error");
                result.put("message", "用户名或密码错误");
            } else if (!user.getIsActive()) {
                result.put("status", "error");
                result.put("message", "账户已被禁用");
            } else {
                result.put("status", "success");
                result.put("message", "登录测试成功");
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("username", user.getUsername());
                userMap.put("realName", user.getRealName());
                userMap.put("role", user.getRole());
                result.put("user", userMap);
            }
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", "登录测试失败: " + e.getMessage());
        }
        
        return ResponseEntity.ok(result);
    }
}