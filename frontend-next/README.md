# 成绩管理系统 - 现代化前端

基于 Next.js 14、TypeScript、Tailwind CSS 和 shadcn/ui 构建的现代化成绩管理系统前端。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **图标**: Font Awesome
- **字体**: Google Fonts (Inter + Noto Sans SC)
- **动画**: Framer Motion
- **状态管理**: React Context API

## 功能特性

- 🎨 现代化的用户界面设计
- 📱 完全响应式布局
- 🔐 用户认证和授权
- 📊 成绩统计和可视化
- 🌐 多语言支持（中文）
- ⚡ 流畅的动画效果
- 🎯 TypeScript 类型安全

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # 仪表板页面
│   ├── login/            # 登录页面
│   ├── globals.css       # 全局样式
│   ├── layout.tsx        # 根布局
│   └── page.tsx          # 首页
├── components/           # 组件
│   ├── ui/              # shadcn/ui 组件
│   ├── icons.tsx        # 图标组件
│   └── motion.tsx       # 动画组件
├── contexts/            # React Context
│   └── auth-context.tsx # 认证上下文
├── lib/                 # 工具库
│   ├── api.ts          # API 服务
│   └── utils.ts        # 工具函数
└── types/               # TypeScript 类型定义
    └── api.ts          # API 类型
```

## 安装和运行

1. 安装依赖：
```bash
cd frontend-next
npm install
```


2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

4. 启动生产服务器：
```bash
npm start
```

## 环境变量

项目使用环境变量管理 API 配置：

### 开发环境
创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 生产环境
创建 `.env.production` 文件：

```env
NEXT_PUBLIC_API_URL=https://your-production-domain.com/api
```

## API 配置最佳实践

- 使用统一的 `apiService` 进行所有 API 调用
- 通过 `NEXT_PUBLIC_API_URL` 环境变量管理 API 基础 URL
- 统一的错误处理和响应格式
- 自动处理认证 token 和请求头
- 支持开发/生产环境的不同配置

## 主要页面

### 登录页面 (`/login`)
- 现代化的登录表单
- 用户名/密码验证
- 错误处理和加载状态
- 默认用户信息提示

### 仪表板页面 (`/dashboard`)
- 成绩统计卡片
- 详细成绩表格
- 用户信息显示
- 退出登录功能

## 组件库

### shadcn/ui 组件
- Button: 按钮组件
- Input: 输入框组件
- Card: 卡片组件
- Label: 标签组件

### 自定义组件
- Icons: Font Awesome 图标封装
- Motion: Framer Motion 动画组件

## 状态管理

使用 React Context API 进行状态管理：
- `AuthContext`: 用户认证状态
- `apiService`: API 调用服务

## 样式系统

- 使用 Tailwind CSS 进行样式管理
- 支持深色模式
- 响应式设计
- CSS 变量主题系统

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 开发指南

1. 遵循 TypeScript 严格模式
2. 使用 ESLint 进行代码检查
3. 组件使用函数式组件和 Hooks
4. API 调用统一使用 `apiService`
5. 样式使用 Tailwind CSS 类名

## 部署

项目可以部署到支持 Node.js 的平台：
- Vercel (推荐)
- Netlify
- AWS Amplify
- 自建服务器

## 许可证

MIT License