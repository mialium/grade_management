package com.grade.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.mybatis.spring.annotation.MapperScan;

@SpringBootApplication
@MapperScan("com.grade.management.mapper")
public class GradeManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(GradeManagementApplication.class, args);
    }
}
