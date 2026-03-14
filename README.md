# Demo 项目

## 项目概述
这是一个全栈Web应用项目，采用前后端分离架构。

## 技术栈

### 前端
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **UI库**: Element Plus (推荐) 或 Ant Design Vue
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **代码规范**: ESLint + Prettier

### 后端
- **运行时**: Node.js
- **语言**: TypeScript
- **框架**: Express.js 或 Koa.js
- **开发工具**: Nodemon + ts-node
- **代码规范**: ESLint + Prettier

## 项目需求

### 核心要求
1. **前端不使用Mock数据**：所有数据必须通过API接口从后端获取
2. **后端暂不连接数据库**：使用内存管理数据（数组/对象存储）
3. **前后端完全分离**：通过RESTful API通信
4. **TypeScript全栈**：前后端均使用TypeScript开发

### 功能模块（示例）
1. **用户管理**
   - 用户注册/登录
   - 用户信息管理
   - 权限控制

2. **数据管理**
   - 数据的增删改查搜
   - 数据列表展示
   - 数据筛选/搜索

3. **系统功能**


## 项目结构
```
Demo/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── api/      # API接口封装
│   │   ├── components/# 组件
│   │   ├── views/    # 页面
│   │   ├── router/   # 路由
│   │   ├── store/    # 状态管理
│   │   └── utils/    # 工具函数
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # 后端项目
│   ├── src/
│   │   ├── controllers/# 控制器
│   │   ├── services/  # 业务逻辑
│   │   ├── routes/    # 路由
│   │   ├── middleware/# 中间件
│   │   ├── types/     # TypeScript类型定义
│   │   └── utils/     # 工具函数
│   ├── package.json
│   └── tsconfig.json
├── README.md          # 项目说明文档
└── package.json       # 根项目配置（可选）
```

## API设计原则
1. **RESTful风格**：使用标准的HTTP方法和状态码
2. **统一响应格式**：
   ```json
   {
     "code": 200,
     "message": "成功",
     "data": {},
     "timestamp": 1678886400000
   }
   ```
3. **错误处理**：统一的错误码和错误信息
4. **接口文档**：使用Swagger/OpenAPI生成API文档

## 开发规范
1. **代码规范**：使用ESLint + Prettier统一代码风格
2. **Git提交规范**：使用Conventional Commits
3. **分支管理**：Git Flow或GitHub Flow
4. **代码审查**：所有代码必须经过Review

## 部署方案
1. **开发环境**：本地开发，热重载
2. **测试环境**：Docker容器化部署
3. **生产环境**：云服务器 + Nginx反向代理

## 待办事项
- [x] 明确项目需求
- [x] 确定技术栈
- [ ] 设计项目架构
- [ ] 初始化前后端项目
- [ ] 配置开发环境
- [ ] 实现基础功能模块
- [ ] 编写单元测试
- [ ] 部署测试环境

## 开发计划
1. **第一阶段**：项目初始化与环境搭建（1-2天）
2. **第二阶段**：基础架构与核心功能（3-5天）
3. **第三阶段**：功能完善与测试（2-3天）
4. **第四阶段**：部署与优化（1-2天）

## 使用说明
1. **前端启动**：
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **后端启动**：
   ```bash
   cd backend
   npm install
   npm run dev
   ```

## 注意事项
1. 前端所有数据请求必须通过API接口，禁止使用Mock数据
2. 后端使用内存存储数据，重启服务后数据会丢失
3. 后续可根据需求添加数据库支持（MySQL/PostgreSQL/MongoDB）
4. 考虑添加Redis缓存提升性能

## 联系方式
项目创建者：Aily  
创建时间：2026-03-13  
最后更新：2026-03-14  
项目状态：需求分析阶段