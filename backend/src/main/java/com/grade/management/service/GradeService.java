package com.grade.management.service;

import com.grade.management.entity.Grade;
import com.grade.management.mapper.GradeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GradeService {
    
    @Autowired
    private GradeMapper gradeMapper;
    
    public List<Grade> findByStudentName(String studentName) {
        return gradeMapper.findByStudentName(studentName);
    }
    
    public List<Grade> findByTeacherName(String teacherName) {
        return gradeMapper.findByTeacherName(teacherName);
    }
    
    public List<Grade> findByCourseName(String courseName) {
        return gradeMapper.findByCourseName(courseName);
    }
    
    public List<Grade> findAll() {
        return gradeMapper.findAll();
    }
    
    public Grade findById(Long id) {
        return gradeMapper.findById(id);
    }
    
    public Grade findByStudentCourseAndSemester(String studentName, String courseName, String semester, String academicYear) {
        return gradeMapper.findByStudentCourseAndSemester(studentName, courseName, semester, academicYear);
    }
    
    public Grade save(Grade grade) {
        if (grade.getId() == null) {
            // 检查是否已存在相同学生、课程、学期、学年的成绩记录
            Grade existingGrade = findByStudentCourseAndSemester(grade.getStudentName(), grade.getCourseName(), grade.getSemester(), grade.getAcademicYear());
            if (existingGrade != null) {
                // 如果存在，更新现有记录
                grade.setId(existingGrade.getId());
                gradeMapper.update(grade);
            } else {
                // 如果不存在，插入新记录
                gradeMapper.insert(grade);
            }
        } else {
            gradeMapper.update(grade);
        }
        return grade;
    }
    
    public List<Grade> saveBatch(List<Grade> grades) {
        if (grades == null || grades.isEmpty()) {
            return grades;
        }
        
        // Filter out grades that need to be inserted (no ID)
        List<Grade> newGrades = grades.stream()
            .filter(grade -> grade.getId() == null)
            .collect(Collectors.toList());
            
        // Filter out grades that need to be updated (have ID)
        List<Grade> existingGrades = grades.stream()
            .filter(grade -> grade.getId() != null)
            .collect(Collectors.toList());
        
        // Batch insert new grades
        if (!newGrades.isEmpty()) {
            gradeMapper.insertBatch(newGrades);
        }
        
        // Update existing grades
        for (Grade grade : existingGrades) {
            gradeMapper.update(grade);
        }
        
        return grades;
    }
    
    public void delete(Long id) {
        gradeMapper.delete(id);
    }
}