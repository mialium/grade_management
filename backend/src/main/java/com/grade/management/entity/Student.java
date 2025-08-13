package com.grade.management.entity;

import lombok.Data;
import java.util.Date;

@Data
public class Student {
    private Long id;
    private String userName;
    private String realName;
    private String studentNumber;
    private String className;
    private String major;
    private String enrollmentYear;
    private String gender;
    private String email;
    private String phone;
    private String address;
    private Date birthDate;
    private String nationality;
    private String politicalStatus;
    private String idCardNumber;
    private Date createdAt;
    private Date updatedAt;
}