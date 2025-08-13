package com.grade.management.service;

import com.grade.management.entity.Student;
import com.grade.management.mapper.StudentMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    
    @Autowired
    private StudentMapper studentMapper;
    
    public List<Student> findByCourseName(String courseName) {
        return studentMapper.findByCourseName(courseName);
    }
    
    public List<Student> findAll() {
        return studentMapper.findAll();
    }
    
    public Student findById(Long id) {
        return studentMapper.findById(id);
    }
    
    public Student findByUsername(String username) {
        return studentMapper.findByUsername(username);
    }
    
    public Student save(Student student) {
        if (student.getId() == null) {
            studentMapper.insert(student);
        } else {
            studentMapper.update(student);
        }
        return student;
    }
    
    public void delete(Long id) {
        studentMapper.delete(id);
    }
}