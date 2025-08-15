package com.grade.management.config;

import com.grade.management.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@Slf4j
@Component
public class JwtFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        
        String path = request.getServletPath();
        log.debug("Processing request for path: {}", path);
        
        // 跳过登录和注册接口的JWT验证
        if (path.startsWith("/api/auth/")) {
            log.debug("Skipping JWT validation for auth path: {}", path);
            chain.doFilter(request, response);
            return;
        }
        
        final String authorizationHeader = request.getHeader("Authorization");
        
        String username = null;
        String jwt = null;
        
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            log.debug("JWT token found for path: {}", path);
            try {
                username = jwtUtil.extractUsername(jwt);
                log.debug("Extracted username from JWT: {}", username);
            } catch (Exception e) {
                log.warn("Failed to extract username from JWT: {}", e.getMessage());
            }
        } else {
            log.debug("No JWT token found for path: {}", path);
        }
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            log.debug("Validating JWT token for user: {}", username);
            if (jwtUtil.validateToken(jwt, username)) {
                log.info("JWT token validated successfully for user: {}", username);
                String role = jwtUtil.extractRole(jwt);
                UsernamePasswordAuthenticationToken authenticationToken = 
                    new UsernamePasswordAuthenticationToken(
                        username, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
                    );
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                
                // 设置请求属性，供控制器使用
                request.setAttribute("username", username);
                request.setAttribute("role", role);
            }
        }
        chain.doFilter(request, response);
    }
}