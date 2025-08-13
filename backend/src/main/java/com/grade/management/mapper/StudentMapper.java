package com.grade.management.mapper;

import com.grade.management.entity.Student;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StudentMapper {
    List<Student> findByCourseName(@Param("courseName") String courseName);
    List<Student> findAll();
    Student findById(@Param("id") Long id);
    Student findByUsername(@Param("username") String username);
    int insert(Student student);
    int update(Student student);
    int delete(@Param("id") Long id);
}