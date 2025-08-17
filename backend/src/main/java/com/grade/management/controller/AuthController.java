package com.grade.management.controller;

import com.grade.management.entity.User;
import com.grade.management.service.UserService;
import com.grade.management.service.EmailService;
import com.grade.management.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.Date;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login attempt for username: {}", loginRequest.getUsername());
            log.info("Password: {}", loginRequest.getPassword());

            if (loginRequest.getUsername() == null || loginRequest.getUsername().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "用户名不能为空");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "密码不能为空");
                return ResponseEntity.badRequest().body(error);
            }
            
            User user = userService.findByUsername(loginRequest.getUsername());
            
            if (user == null) {
                System.out.println("User not found: " + loginRequest.getUsername());
                Map<String, String> error = new HashMap<>();
                error.put("message", "用户名或密码错误");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (!userService.validatePassword(loginRequest.getPassword(), user.getPassword())) {
                System.out.println("Invalid password for user: " + loginRequest.getUsername());
                Map<String, String> error = new HashMap<>();
                error.put("message", "用户名或密码错误");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (!user.getIsActive()) {
                System.out.println("User account disabled: " + loginRequest.getUsername());
                Map<String, String> error = new HashMap<>();
                error.put("message", "账户已被禁用");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (!user.getIsEmailVerified()) {
                System.out.println("Email not verified for user: " + loginRequest.getUsername());
                Map<String, String> error = new HashMap<>();
                error.put("message", "请先验证您的邮箱");
                return ResponseEntity.badRequest().body(error);
            }
            
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", user.getUsername());
            response.put("role", user.getRole());
            response.put("realName", user.getRealName());
            response.put("userId", user.getId());
            
            System.out.println("Login successful for user: " + loginRequest.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "登录失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            // 验证输入
            if (registerRequest.getUsername() == null || registerRequest.getUsername().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "用户名不能为空");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "邮箱不能为空");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (registerRequest.getPassword() == null || registerRequest.getPassword().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "密码不能为空");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (userService.findByUsername(registerRequest.getUsername()) != null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "用户名已存在");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (userService.findByEmail(registerRequest.getEmail()) != null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "邮箱已被注册");
                return ResponseEntity.badRequest().body(error);
            }
            
            // 创建用户
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());
            user.setRealName(registerRequest.getRealName());
            user.setRole("STUDENT"); // 默认角色为学生
            user.setIsActive(true);
            user.setIsEmailVerified(false);
            
            // 生成邮件验证令牌
            String verificationToken = UUID.randomUUID().toString();
            user.setEmailVerificationToken(verificationToken);
            
            // 设置令牌过期时间（24小时）
            Date expiration = new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000);
            user.setEmailVerificationExpires(expiration);
            
            User registeredUser = userService.registerWithEmailVerification(user);
            
            // 发送验证邮件
            try {
                emailService.sendVerificationEmail(registeredUser.getEmail(), verificationToken);
            } catch (Exception e) {
                System.out.println("Failed to send verification email: " + e.getMessage());
                // 即使邮件发送失败，用户注册仍然成功
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "注册成功，请查收邮件进行验证");
            response.put("userId", registeredUser.getId());
            response.put("email", registeredUser.getEmail());
            
            log.info("User registered successfully: {}", registerRequest.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Registration error: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", "注册失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            User user = userService.findByVerificationToken(token);
            
            if (user == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "无效的验证链接");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (user.getEmailVerificationExpires().before(new Date())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "验证链接已过期");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (user.getIsEmailVerified()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "邮箱已经验证过了");
                return ResponseEntity.badRequest().body(error);
            }
            
            userService.verifyEmail(user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "邮箱验证成功，现在可以登录了");
            response.put("username", user.getUsername());
            
            log.info("Email verification successful for user: {}", user.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Email verification error: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "邮箱验证失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody ResendVerificationRequest request) {
        try {
            User user = userService.findByEmail(request.getEmail());
            
            if (user == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "用户不存在");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (user.getIsEmailVerified()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "邮箱已经验证过了");
                return ResponseEntity.badRequest().body(error);
            }
            
            // 生成新的验证令牌
            String verificationToken = UUID.randomUUID().toString();
            user.setEmailVerificationToken(verificationToken);
            
            // 设置令牌过期时间（24小时）
            Date expiration = new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000);
            user.setEmailVerificationExpires(expiration);
            
            userService.update(user);
            
            // 发送验证邮件
            emailService.sendVerificationEmail(user.getEmail(), verificationToken);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "验证邮件已重新发送");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Resend verification error: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "重发验证邮件失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    public static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
    
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String realName;
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
        
        public String getRealName() {
            return realName;
        }
        
        public void setRealName(String realName) {
            this.realName = realName;
        }
    }
    
    public static class ResendVerificationRequest {
        private String email;
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
    }
}