# Backend - Demo项目后端

基于NestJS开发的后端API服务

## 技术栈
- **框架**: NestJS
- **语言**: TypeScript
- **数据库**: SQLite (开发环境) / PostgreSQL (生产环境)
- **ORM**: TypeORM
- **API文档**: Swagger/OpenAPI

## 数据库说明

### 开发环境
当前使用 **SQLite** 作为开发数据库，数据存储在 `demo.db` 文件中。

优势：
- 无需安装，开箱即用
- 数据存储在本地文件，重启不丢失
- 适合开发和测试

### 生产环境
如需切换到 **PostgreSQL**：

1. 确保Docker已启动
2. 运行 `docker compose up -d` 启动PostgreSQL
3. 修改 `src/app.module.ts` 中的数据库配置
4. 删除 `demo.db` 文件
5. 重启服务

## 功能模块

### 认证模块 (Auth)
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/logout` - 用户登出

### 用户模块 (Users)
- `GET /api/users` - 获取用户列表（支持分页、搜索）
- `GET /api/users/:id` - 获取用户详情
- `POST /api/users` - 创建用户
- `PUT /api/users/:id` - 更新用户信息
- `DELETE /api/users/:id` - 删除用户

## 快速开始

### 安装依赖
```bash
cd backend
npm install
```

### 启动开发服务器
```bash
npm run start:dev
```

### 访问地址
- API服务: http://localhost:3000
- Swagger文档: http://localhost:3000/api-docs

## API响应格式

```json
{
  "code": 200,
  "message": "成功",
  "data": {},
  "timestamp": 1773470705000
}
```

## 注意事项
- 数据存储在SQLite数据库中（demo.db）
- 生产环境建议使用PostgreSQL
- 密码明文存储（生产环境需加密）
