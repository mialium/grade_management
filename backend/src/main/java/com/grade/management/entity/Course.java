package com.grade.management.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class Course {
    private Long id;
    private String courseName;
    private String courseCode;
    private BigDecimal credit;
    private String teacherName;
    private String courseType;
    private Integer courseHours;
    private String courseDescription;
    private String department;
    private String classroom;
    private Integer maxStudents;
    private Integer currentStudents;
    private Boolean isActive;
    private Date createdAt;
    private Date updatedAt;
}