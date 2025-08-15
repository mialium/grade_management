package com.grade.management.service;

import com.resend.*;
import com.resend.services.emails.model.SendEmailRequest;
import com.resend.services.emails.model.SendEmailResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {
    
    @Value("${resend.api-key}")
    private String resendApiKey;
    
    @Value("${resend.from-email}")
    private String fromEmail;
    
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;
    
    @Override
    public void sendVerificationEmail(String to, String token) {
        try {
            log.info("Sending verification email to: {}", to);
            Resend resend = new Resend(resendApiKey);
            
            String verificationUrl = baseUrl + "/api/auth/verify-email?token=" + token;
            SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                    .from(fromEmail)
                    .to(to)
                    .subject("成绩管理系统 - 邮箱验证")
                    .html("<p>尊敬的用户：</p>" +
                          "<p>请点击以下链接验证您的邮箱：</p>" +
                          "<p><a href=\"" + verificationUrl + "\">验证邮箱</a></p>" +
                          "<p>或者复制以下链接到浏览器：</p>" +
                          "<p>" + verificationUrl + "</p>" +
                          "<p>此链接24小时内有效。</p>" +
                          "<p>如果您没有注册成绩管理系统，请忽略此邮件。</p>" +
                          "<p>成绩管理系统团队</p>")
                    .build();
            
            SendEmailResponse data = resend.emails().send(sendEmailRequest);
            log.info("Verification email sent successfully to: {} - ID: {}", to, data.getId());
        } catch (Exception e) {
            log.error("Failed to send verification email to: {} - Error: {}", to, e.getMessage(), e);
            // 不抛出异常，允许注册流程继续
        }
    }
}