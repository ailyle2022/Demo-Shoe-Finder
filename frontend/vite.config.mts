import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  // 从环境变量获取端口，默认为8080
  const port = parseInt(env.VITE_PORT || '8080', 10)
  
  // 从环境变量获取主机，默认为localhost
  const host = env.VITE_DEV_SERVER_HOST || 'localhost'
  
  // 从环境变量获取是否自动打开浏览器
  const open = env.VITE_DEV_SERVER_OPEN === 'true'
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port,
      host,
      open,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    // 构建配置
    build: {
      sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
      minify: env.VITE_BUILD_MINIFY !== 'false'
    }
  }
})