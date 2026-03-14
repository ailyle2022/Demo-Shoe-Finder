# 前端项目 - Vue 3 + TypeScript

## 项目概述
根据README.md的要求，这是一个Vue 3 + TypeScript前端项目，所有数据通过API接口从后端获取，不使用Mock数据。

## 技术栈
- **框架**: Vue 3 + Composition API
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **UI库**: Element Plus
- **代码规范**: ESLint + Prettier

## 项目结构
```
frontend/
├── src/
│   ├── api/           # API接口封装
│   │   └── health.ts  # 健康检查API
│   ├── components/    # 公共组件
│   ├── views/         # 页面组件
│   │   └── HomeView.vue # 首页
│   ├── router/        # 路由配置
│   │   └── index.ts
│   ├── store/         # 状态管理（Pinia）
│   ├── utils/         # 工具函数
│   ├── types/         # TypeScript类型定义
│   ├── App.vue        # 根组件
│   ├── main.ts        # 入口文件
│   └── style.css      # 全局样式
├── public/            # 静态资源
├── index.html         # HTML模板
├── package.json       # 依赖配置
├── tsconfig.json      # TypeScript配置
├── vite.config.ts     # Vite配置
├── .env.development   # 开发环境变量
├── .env.production    # 生产环境变量
├── .eslintrc.cjs      # ESLint配置
├── .prettierrc.json   # Prettier配置
└── .gitignore         # Git忽略文件
```

## 核心特性
1. **TypeScript全栈**：完整的类型安全
2. **API驱动**：所有数据通过接口获取，无Mock数据
3. **开发体验**：热重载、代码提示、类型检查
4. **代码规范**：统一的代码风格和质量检查

## 安装依赖
```bash
cd frontend
npm install
```

## 启动开发服务器
```bash
npm run dev
```
访问：http://localhost:3000

## 构建生产版本
```bash
npm run build
```

## 代码检查
```bash
# 代码格式化
npm run format

# 代码检查与修复
npm run lint
```

## API配置
前端通过代理访问后端API：
- 开发环境：`http://localhost:3001/api`
- 生产环境：`/api`

## 开发规范
1. **组件命名**：使用大驼峰命名法
2. **API封装**：所有接口统一在 `src/api/` 目录中管理
3. **类型定义**：为所有数据定义TypeScript接口
4. **错误处理**：统一的错误处理机制
5. **响应式设计**：支持移动端和桌面端

## 注意事项
1. **不使用Mock数据**：所有数据必须通过API接口获取
2. **类型安全**：充分利用TypeScript的类型检查
3. **性能优化**：按需加载、代码分割、图片优化
4. **浏览器兼容**：支持现代浏览器

## 下一步
1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`
3. 开始开发前端功能模块