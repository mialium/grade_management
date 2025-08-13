package com.grade.management.controller;

import com.grade.management.entity.Grade;
import com.grade.management.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {
    
    @Autowired
    private GradeService gradeService;
    
    @GetMapping("/overview")
    public ResponseEntity<?> getOverviewStatistics() {
        try {
            List<Grade> allGrades = gradeService.findAll();
            
            // 基础统计
            Map<String, Object> overview = new HashMap<>();
            overview.put("totalGrades", allGrades.size());
            
            // 平均分计算
            double average = allGrades.stream()
                .mapToDouble(g -> g.getScore().doubleValue())
                .average()
                .orElse(0.0);
            overview.put("averageScore", Math.round(average * 100) / 100.0);
            
            // 最高分和最低分
            double maxScore = allGrades.stream()
                .mapToDouble(g -> g.getScore().doubleValue())
                .max()
                .orElse(0.0);
            double minScore = allGrades.stream()
                .mapToDouble(g -> g.getScore().doubleValue())
                .min()
                .orElse(0.0);
            overview.put("maxScore", (int) Math.round(maxScore));
            overview.put("minScore", (int) Math.round(minScore));
            
            // 分数段分布
            Map<String, Integer> scoreDistribution = new HashMap<>();
            scoreDistribution.put("90-100", (int) allGrades.stream().filter(g -> g.getScore().doubleValue() >= 90).count());
            scoreDistribution.put("80-89", (int) allGrades.stream().filter(g -> g.getScore().doubleValue() >= 80 && g.getScore().doubleValue() < 90).count());
            scoreDistribution.put("70-79", (int) allGrades.stream().filter(g -> g.getScore().doubleValue() >= 70 && g.getScore().doubleValue() < 80).count());
            scoreDistribution.put("60-69", (int) allGrades.stream().filter(g -> g.getScore().doubleValue() >= 60 && g.getScore().doubleValue() < 70).count());
            scoreDistribution.put("0-59", (int) allGrades.stream().filter(g -> g.getScore().doubleValue() < 60).count());
            overview.put("scoreDistribution", scoreDistribution);
            
            // 及格率
            double passRate = allGrades.isEmpty() ? 0 : 
                (double) allGrades.stream().filter(g -> g.getScore().doubleValue() >= 60).count() / allGrades.size() * 100;
            overview.put("passRate", Math.round(passRate * 100) / 100.0);
            
            return ResponseEntity.ok(overview);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "获取统计数据失败");
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/courses")
    public ResponseEntity<?> getCourseStatistics() {
        try {
            List<Grade> allGrades = gradeService.findAll();
            
            // 按课程分组统计
            Map<String, List<Grade>> gradesByCourse = allGrades.stream()
                .collect(Collectors.groupingBy(g -> g.getCourse() != null ? g.getCourse().getCourseName() : "未知课程"));
            
            List<Map<String, Object>> courseStats = gradesByCourse.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> stats = new HashMap<>();
                    List<Grade> courseGrades = entry.getValue();
                    
                    stats.put("courseName", entry.getKey());
                    stats.put("studentCount", courseGrades.size());
                    
                    double avgScore = courseGrades.stream()
                        .mapToDouble(g -> g.getScore().doubleValue())
                        .average()
                        .orElse(0.0);
                    stats.put("averageScore", Math.round(avgScore * 100) / 100.0);
                    
                    double maxScore = courseGrades.stream()
                        .mapToDouble(g -> g.getScore().doubleValue())
                        .max()
                        .orElse(0.0);
                    double minScore = courseGrades.stream()
                        .mapToDouble(g -> g.getScore().doubleValue())
                        .min()
                        .orElse(0.0);
                    stats.put("maxScore", (int) Math.round(maxScore));
                    stats.put("minScore", (int) Math.round(minScore));
                    
                    double passRate = courseGrades.isEmpty() ? 0 :
                        (double) courseGrades.stream().filter(g -> g.getScore().doubleValue() >= 60).count() / courseGrades.size() * 100;
                    stats.put("passRate", Math.round(passRate * 100) / 100.0);
                    
                    return stats;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(courseStats);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "获取课程统计失败");
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/trends")
    public ResponseEntity<?> getGradeTrends() {
        try {
            List<Grade> allGrades = gradeService.findAll();
            
            // 按学期分组统计
            Map<String, List<Grade>> gradesBySemester = allGrades.stream()
                .collect(Collectors.groupingBy(Grade::getSemester));
            
            List<Map<String, Object>> trendData = gradesBySemester.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> trend = new HashMap<>();
                    List<Grade> semesterGrades = entry.getValue();
                    
                    trend.put("semester", entry.getKey());
                    trend.put("gradeCount", semesterGrades.size());
                    
                    double avgScore = semesterGrades.stream()
                        .mapToDouble(g -> g.getScore().doubleValue())
                        .average()
                        .orElse(0.0);
                    trend.put("averageScore", Math.round(avgScore * 100) / 100.0);
                    
                    double passRate = semesterGrades.isEmpty() ? 0 :
                        (double) semesterGrades.stream().filter(g -> g.getScore().doubleValue() >= 60).count() / semesterGrades.size() * 100;
                    trend.put("passRate", Math.round(passRate * 100) / 100.0);
                    
                    return trend;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(trendData);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "获取趋势数据失败");
            return ResponseEntity.badRequest().body(error);
        }
    }
}