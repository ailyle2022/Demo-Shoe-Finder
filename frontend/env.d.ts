/// <reference types="vite/client" />

// 环境变量类型定义
interface ImportMetaEnv {
  readonly VITE_PORT: string
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEV_SERVER_HOST: string
  readonly VITE_DEV_SERVER_OPEN: string
  readonly VITE_BUILD_SOURCEMAP: string
  readonly VITE_BUILD_MINIFY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}