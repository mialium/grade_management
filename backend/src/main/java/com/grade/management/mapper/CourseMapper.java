package com.grade.management.mapper;

import com.grade.management.entity.Course;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CourseMapper {
    List<Course> findByTeacherName(@Param("teacherName") String teacherName);
    List<Course> findAll();
    Course findById(@Param("id") Long id);
    int insert(Course course);
    int update(Course course);
    int delete(@Param("id") Long id);
}