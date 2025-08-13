package com.grade.management.service;

import com.resend.*;
import com.resend.services.emails.model.SendEmailRequest;
import com.resend.services.emails.model.SendEmailResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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
            Resend resend = new Resend("re_GhK6N4YK_AjQoi7J2ZnBC1g5Pfm72sKWd");
            
            SendEmailRequest sendEmailRequest = SendEmailRequest.builder()
                    .from("kaoshi<noreply@200574.xyz>")
                    .to(to)
                    .subject("成绩管理系统 - 邮箱验证")
                    .html("<p>尊敬的用户：</p>" +
                          "<p>请点击以下链接验证您的邮箱：</p>" +
                          "<p><a href=\"" + baseUrl + "/api/auth/verify-email?token=" + token + "\">验证邮箱</a></p>" +
                          "<p>或者复制以下链接到浏览器：</p>" +
                          "<p>" + baseUrl + "/api/auth/verify-email?token=" + token + "</p>" +
                          "<p>此链接24小时内有效。</p>" +
                          "<p>如果您没有注册成绩管理系统，请忽略此邮件。</p>" +
                          "<p>成绩管理系统团队</p>")
                    .build();
            
            SendEmailResponse data = resend.emails().send(sendEmailRequest);
            System.out.println("Verification email sent to: " + to + " - ID: " + data.getId());
        } catch (Exception e) {
            System.out.println("Failed to send verification email to: " + to + " - Error: " + e.getMessage());
            // 不抛出异常，允许注册流程继续
        }
    }
}