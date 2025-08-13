package com.grade.management.service;

import com.grade.management.entity.Course;
import com.grade.management.mapper.CourseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    
    @Autowired
    private CourseMapper courseMapper;
    
    public List<Course> findByTeacherName(String teacherName) {
        return courseMapper.findByTeacherName(teacherName);
    }
    
    public List<Course> findAll() {
        return courseMapper.findAll();
    }
    
    public Course findById(Long id) {
        return courseMapper.findById(id);
    }
    
    public Course save(Course course) {
        if (course.getId() == null) {
            courseMapper.insert(course);
        } else {
            courseMapper.update(course);
        }
        return course;
    }
    
    public void delete(Long id) {
        courseMapper.delete(id);
    }
}