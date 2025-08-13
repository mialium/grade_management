package com.grade.management.entity;

import lombok.Data;
import java.util.Date;

@Data
public class User {
    private Long id;
    private String username;
    private String password;
    private String realName;
    private String role;
    private String studentId;
    private String email;
    private String phone;
    private String className;
    private String major;
    private String enrollmentYear;
    private String gender;
    private Date createdAt;
    private Date updatedAt;
    private Boolean isActive;
    private Boolean isEmailVerified;
    private String emailVerificationToken;
    private Date emailVerificationExpires;
    private Date lastLoginAt;
    private String avatarUrl;
    private String department;
    private String address;
    private String notes;
}