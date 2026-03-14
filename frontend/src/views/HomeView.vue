<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo" v-show="!sidebarCollapsed">
          <div class="logo-mark">A</div>
          <span>Admin</span>
        </div>
        <div class="logo-mini" v-show="sidebarCollapsed">
          <div class="logo-mark">A</div>
        </div>
        <button class="collapse-btn" @click="toggleSidebar">
          <span v-if="sidebarCollapsed">→</span>
          <span v-else>←</span>
        </button>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        background-color="transparent"
        text-color="#4b5563"
        active-text-color="#2563eb"
        :collapse="sidebarCollapsed"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/">
          <span>Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <span>Users</span>
        </el-menu-item>
        <el-menu-item index="/products">
          <span>Products</span>
        </el-menu-item>
        <el-menu-item index="/questions">
          <span>Questions</span>
        </el-menu-item>
        <el-menu-item index="/quiz">
          <span>Quiz</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <span>Settings</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <!-- 右侧内容区 -->
    <div class="main">
      <!-- 顶部导航 -->
      <header class="header">
        <div class="header-left">
          <span class="page-title">{{ pageTitle }}</span>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <div class="avatar">{{ userInitial }}</div>
              <span class="username">{{ userInfo?.username || 'Admin' }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">Profile</el-dropdown-item>
                <el-dropdown-item command="logout" divided>Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 内容区 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const sidebarCollapsed = ref(false)
const userInfo = ref<any>(null)

const activeMenu = computed(() => route.path)

const userInitial = computed(() => {
  if (userInfo.value?.username) {
    return userInfo.value.username.charAt(0).toUpperCase()
  }
  return 'A'
})

const pageTitle = computed(() => {
  const pathMap: Record<string, string> = {
    '/': 'Dashboard',
    '/users': 'Users',
    '/products': 'Products',
    '/questions': 'Questions',
    '/quiz': 'Quiz',
    '/settings': 'Settings'
  }
  return pathMap[route.path] || 'Dashboard'
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

onMounted(() => {
  const info = localStorage.getItem('userInfo')
  if (info) {
    userInfo.value = JSON.parse(info)
  }
})

const handleCommand = (command: string) => {
  if (command === 'logout') {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    ElMessage.success('Logout successful')
    router.push('/login')
  } else if (command === 'profile') {
    ElMessage.info('Profile page coming soon')
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  background: #f7f8fa;
}

.sidebar {
  width: 240px;
  background: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e5e7eb;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 72px;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
}

.logo span {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.logo-mini {
  display: flex;
  justify-content: center;
}

.collapse-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 12px;
  transition: background 0.2s;
}

.collapse-btn:hover {
  background: #e5e7eb;
}

.sidebar-menu {
  border-right: none;
  padding: 12px 8px;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  margin-bottom: 4px;
  color: #4b5563;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background: #f3f4f6;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: #eff6ff;
  color: #2563eb;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 60px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f3f4f6;
}

.avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  color: white;
}

.username {
  color: #374151;
  font-size: 14px;
  font-weight: 500;
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}
</style>
