package com.grade.management.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class Grade {
    private Long id;
    private String studentName;
    private String courseName;
    private String teacherName;
    private BigDecimal score;
    private BigDecimal gradePoint;
    private String letterGrade;
    private String semester;
    private String academicYear;
    private String gradingStatus;
    private String comments;
    private Boolean isFinal;
    private Date createdAt;
    private Date updatedAt;
    
    private Student student;
    private Course course;
}