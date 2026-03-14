# 环境变量配置指南

## 环境变量文件优先级
Vite按照以下顺序加载环境变量（后面的覆盖前面的）：
1. `.env` - 通用配置
2. `.env.local` - 本地覆盖（不提交到Git）
3. `.env.development` - 开发环境
4. `.env.production` - 生产环境
5. `.env.development.local` - 开发本地覆盖
6. `.env.production.local` - 生产本地覆盖

## 可用环境变量

### 服务器配置
| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `VITE_PORT` | `3000` | 开发服务器端口 |
| `VITE_DEV_SERVER_HOST` | `localhost` | 开发服务器主机 |
| `VITE_DEV_SERVER_OPEN` | `true` | 是否自动打开浏览器 |

### 应用配置
| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `VITE_APP_TITLE` | `Demo Application` | 应用标题 |
| `VITE_API_BASE_URL` | `http://localhost:3001/api` | API基础URL |

### 构建配置
| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `VITE_BUILD_SOURCEMAP` | `true` | 是否生成sourcemap |
| `VITE_BUILD_MINIFY` | `true` | 是否压缩代码 |

## 使用示例

### 示例1：修改端口为8080
创建 `.env.local` 文件：
```env
VITE_PORT=8080
```

### 示例2：修改API地址
创建 `.env.development.local` 文件：
```env
VITE_API_BASE_URL=http://api.example.com/api
```

### 示例3：禁用自动打开浏览器
```env
VITE_DEV_SERVER_OPEN=false
```

## 环境变量在代码中的使用

### 在Vite配置中
```typescript
// vite.config.ts
const env = loadEnv(mode, process.cwd(), '')
const port = parseInt(env.VITE_PORT || '3000', 10)
```

### 在Vue组件中
```typescript
// 任何Vue组件中
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const appTitle = import.meta.env.VITE_APP_TITLE
```

### 在TypeScript中
如果需要类型提示，可以在 `src/env.d.ts` 中添加：
```typescript
interface ImportMetaEnv {
  readonly VITE_PORT: string
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  // 其他环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

## 常用配置场景

### 开发环境
```env
# .env.development
VITE_APP_TITLE=Demo Development
VITE_API_BASE_URL=http://localhost:3001/api
VITE_PORT=3000
VITE_DEV_SERVER_OPEN=true
```

### 生产环境
```env
# .env.production
VITE_APP_TITLE=Demo Production
VITE_API_BASE_URL=/api
VITE_PORT=3000
VITE_DEV_SERVER_OPEN=false
VITE_BUILD_SOURCEMAP=false
```

### 测试环境
```env
# .env.test
VITE_APP_TITLE=Demo Test
VITE_API_BASE_URL=http://test-api.example.com/api
VITE_PORT=3001
```

## 管理脚本更新

服务管理脚本 `manage_frontend.sh` 已更新，支持通过环境变量配置端口：

```bash
# 使用自定义端口启动
VITE_PORT=8080 ./manage_frontend.sh start

# 或者先设置环境变量
export VITE_PORT=8080
./manage_frontend.sh start
```

## 注意事项

1. **敏感信息**：不要在 `.env` 文件中存储敏感信息（如密码、密钥）
2. **Git忽略**：`.env.local` 和 `.env.*.local` 文件已添加到 `.gitignore`
3. **类型安全**：环境变量都是字符串类型，需要时进行类型转换
4. **重启生效**：修改环境变量后需要重启开发服务器

## 故障排除

### 问题：环境变量不生效
**解决方案**：
1. 检查文件命名是否正确
2. 检查文件位置（应在项目根目录）
3. 重启开发服务器
4. 检查变量名前缀是否为 `VITE_`

### 问题：端口被占用
**解决方案**：
1. 修改 `VITE_PORT` 环境变量
2. 或者停止占用端口的进程

### 问题：API代理不工作
**解决方案**：
1. 检查 `VITE_API_BASE_URL` 配置
2. 确保代理规则正确
3. 检查后端服务是否运行