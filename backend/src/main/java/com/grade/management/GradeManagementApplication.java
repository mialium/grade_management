package com.grade.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.mybatis.spring.annotation.MapperScan;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
@MapperScan("com.grade.management.mapper")
public class GradeManagementApplication {
    public static void main(String[] args) {
        log.info("Starting Grade Management Application...");
        SpringApplication.run(GradeManagementApplication.class, args);
        log.info("Grade Management Application started successfully");
    }
}
