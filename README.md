# 成绩管理系统

一个基于 Spring Boot + MyBatis + MySQL 的成绩管理系统，前端使用 HTML + CSS + JavaScript + AJAX。

## 功能特性

- 用户登录（学生、教师、管理员）
- 成绩查看
- 基于角色的权限控制
- JWT 认证
- 响应式界面设计

## 技术栈

### 后端
- Spring Boot 2.7.0
- MyBatis 2.2.2
- MySQL
- Spring Security
- JWT

### 前端
- HTML5
- CSS3
- JavaScript (ES6+)
- AJAX

## 系统要求

- JDK 8+
- Maven 3.6+
- MySQL 5.7+
- 现代浏览器

## 安装说明

### 1. 数据库配置

1. 创建 MySQL 数据库：
   ```sql
   CREATE DATABASE grade_management;
   ```

2. 执行 `schema.sql` 文件创建表结构和初始数据：
   ```bash
   mysql -u root -p grade_management < schema.sql
   ```

3. 修改数据库连接配置（如果需要）：
   - 文件路径：`backend/src/main/resources/application.yml`
   - 默认配置：用户名为 root，密码为 root

### 2. 后端启动

1. 进入后端目录：
   ```bash
   cd backend
   ```

2. 编译项目：
   ```bash
   mvn clean compile
   ```

3. 运行项目：
   ```bash
   mvn spring-boot:run
   ```

后端服务将在 `http://localhost:8080` 启动。

### 3. 前端启动

1. 进入前端目录：
   ```bash
   cd frontend
   ```

2. 使用简单的 HTTP 服务器启动（如 Python 的 SimpleHTTPServer）：
   ```bash
   # Python 3
   python -m http.server 8081
   
   # 或 Python 2
   python -m SimpleHTTPServer 8081
   ```

前端服务将在 `http://localhost:8081` 启动。

## 使用说明

### 默认用户

- **管理员**：用户名 `admin`，密码 `password`
- **教师**：用户名 `teacher1`，密码 `password`
- **学生**：用户名 `student1`，密码 `password`

### 访问地址

- 前端登录页面：`http://localhost:8081/login.html`
- 后端 API：`http://localhost:8080/api`

### 功能权限

- **学生**：只能查看自己的成绩
- **教师**：可以查看自己所教课程的学生成绩
- **管理员**：可以查看所有成绩，进行增删改查操作

## API 接口

### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 成绩接口
- `GET /api/student/grades` - 学生查看自己的成绩
- `GET /api/teacher/grades` - 教师查看所教课程成绩
- `GET /api/admin/grades` - 管理员查看所有成绩
- `POST /api/admin/grades` - 管理员添加成绩
- `PUT /api/admin/grades/{id}` - 管理员修改成绩
- `DELETE /api/admin/grades/{id}` - 管理员删除成绩

## 项目结构

```
grade-management-system/
├── backend/                 # Spring Boot 后端
│   ├── src/main/java/com/grade/management/
│   │   ├── controller/     # 控制器
│   │   ├── service/        # 服务层
│   │   ├── mapper/         # MyBatis 映射器
│   │   ├── entity/         # 实体类
│   │   ├── config/         # 配置类
│   │   └── util/           # 工具类
│   ├── src/main/resources/
│   │   ├── mapper/         # MyBatis XML 文件
│   │   ├── static/         # 静态资源
│   │   ├── templates/      # 模板文件
│   │   └── application.yml # 配置文件
│   └── pom.xml            # Maven 配置
├── frontend/               # 前端
│   ├── css/               # 样式文件
│   ├── js/                # JavaScript 文件
│   ├── images/            # 图片资源
│   ├── login.html         # 登录页面
│   └── grades.html        # 成绩查看页面
└── schema.sql             # 数据库结构
```

## 开发说明

### 数据库设计

系统包含三个主要表：
- `users` - 用户表（学生、教师、管理员）
- `courses` - 课程表
- `grades` - 成绩表

### 安全特性

- 使用 BCrypt 加密存储密码
- JWT 令牌认证
- 基于角色的访问控制
- CORS 配置

### 前端特性

- 响应式设计，支持移动端
- 现代化的 UI 界面
- 基于 AJAX 的异步请求
- 本地存储用户信息

## 注意事项

1. 确保数据库配置正确
2. 确保 MySQL 服务已启动
3. 前端和后端端口不要冲突
4. 默认密码仅为测试使用，生产环境请修改

## 故障排除

- **数据库连接失败**：检查 MySQL 服务状态和连接配置
- **前端无法访问后端**：检查 CORS 配置和防火墙设置
- **登录失败**：检查用户名密码是否正确，确认数据库中有数据

## 扩展功能

系统可以进一步扩展的功能：
- 成绩统计分析
- 课程管理
- 用户管理
- 批量导入导出成绩
- 成绩修改申请流程
- 通知公告系统