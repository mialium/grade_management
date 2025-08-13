package com.grade.management.mapper;

import com.grade.management.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {
    User findByUsername(@Param("username") String username);
    User findByEmail(@Param("email") String email);
    User findByVerificationToken(@Param("token") String token);
    User findById(@Param("id") Long id);
    List<User> findAll();
    int insert(User user);
    int update(User user);
    int delete(@Param("id") Long id);
}