package com.grade.management.mapper;

import com.grade.management.entity.Grade;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface GradeMapper {
    List<Grade> findByStudentName(@Param("studentName") String studentName);
    List<Grade> findByTeacherName(@Param("teacherName") String teacherName);
    List<Grade> findByCourseName(@Param("courseName") String courseName);
    List<Grade> findAll();
    Grade findById(@Param("id") Long id);
    int insert(Grade grade);
    int update(Grade grade);
    int delete(@Param("id") Long id);
    void insertBatch(@Param("grades") List<Grade> grades);
    Grade findByStudentCourseAndSemester(@Param("studentName") String studentName, @Param("courseName") String courseName, @Param("semester") String semester, @Param("academicYear") String academicYear);
}