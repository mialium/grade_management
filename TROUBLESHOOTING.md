
# 成绩管理系统 - 故障排除指南

## 常见问题及解决方案

### 1. 登录显示"网络错误"

#### 可能原因及解决方案：

**A. 后端服务未启动**
- 症状：浏览器控制台显示"Failed to fetch"
- 解决方案：
  1. 打开命令行，进入项目目录
  2. 运行 `start-backend.bat` 或手动启动：
     ```
     cd backend
     mvn spring-boot:run
     ```
  3. 等待看到 "Started GradeManagementApplication" 消息

**B. 数据库连接失败**
- 症状：后端日志显示数据库连接错误
- 解决方案：
  1. 确认MySQL服务已启动
  2. 检查数据库配置（application.yml）
  3. 创建数据库：`CREATE DATABASE grade_management;`
  4. 执行schema.sql文件

**C. CORS跨域问题**
- 症状：浏览器控制台显示CORS错误
- 解决方案：
  1. 确认后端CORS配置正确
  2. 检查前端访问端口是否正确

**D. 防火墙阻止连接**
- 症状：无法连接到localhost:8080
- 解决方案：
  1. 临时关闭防火墙测试
  2. 添加防火墙例外规则

### 2. 数据库相关问题

#### MySQL连接失败
```bash
# 检查MySQL服务状态
net start | findstr MySQL

# 启动MySQL服务
net start MySQL

# 连接MySQL测试
mysql -u root -p777444
```

#### 数据库不存在
```sql
-- 创建数据库
CREATE DATABASE grade_management;

-- 使用数据库
USE grade_management;

-- 导入表结构
source schema.sql;
```

### 3. 端口冲突

#### 8080端口被占用
```bash
# 查看端口占用
netstat -an | findstr :8080

# 结束占用进程
taskkill /PID <进程ID> /F
```

#### 8081端口被占用
```bash
# 使用其他端口启动前端
python -m http.server 8082
```

### 4. 调试步骤

#### 第一步：测试后端连接
1. 打开浏览器访问：`http://localhost:8080`
2. 应该看到Whitelabel Error Page（这表示服务在运行）

#### 第二步：测试API
1. 使用API测试工具：`frontend/api-test.html`
2. 点击"测试连接"按钮
3. 查看详细错误信息

#### 第三步：检查浏览器控制台
1. 按F12打开开发者工具
2. 查看Console标签的错误信息
3. 查看Network标签的请求状态

#### 第四步：检查后端日志
1. 查看后端启动日志
2. 寻找错误信息和异常堆栈

### 5. 完整的重启流程

1. **停止所有服务**
   ```bash
   # 关闭后端（Ctrl+C）
   # 关闭前端（Ctrl+C）
   ```

2. **重置数据库**
   ```bash
   mysql -u root -p777444 -e "DROP DATABASE IF EXISTS grade_management;"
   mysql -u root -p777444 -e "CREATE DATABASE grade_management;"
   mysql -u root -p777444 grade_management < schema.sql
   ```

3. **重新启动服务**
   ```bash
   # 启动后端
   cd backend
   mvn clean spring-boot:run
   
   # 新开终端启动前端
   cd frontend
   python -m http.server 8081
   ```

### 6. 常见错误代码

- **404 Not Found**: API路径错误
- **500 Internal Server Error**: 后端代码错误
- **403 Forbidden**: 权限问题
- **401 Unauthorized**: 认证失败

### 7. 联系支持

如果问题仍然存在，请提供以下信息：
1. 完整的错误消息
2. 浏览器控制台截图
3. 后端启动日志
4. 操作系统版本
5. Java和MySQL版本

### 8. 快速修复命令

```bash
# 一键重置（Windows）
@echo off
echo 正在重置系统...
taskkill /F /IM java.exe 2>nul
mysql -u root -p777444 -e "DROP DATABASE IF EXISTS grade_management;"
mysql -u root -p777444 -e "CREATE DATABASE grade_management;"
mysql -u root -p777444 grade_management < schema.sql
echo 系统重置完成，请重新启动服务
pause
```