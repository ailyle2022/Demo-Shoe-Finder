<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="logo-mark">A</div>
        <h1 class="title">Welcome back</h1>
        <p class="subtitle">Enter your credentials to access your account</p>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form">
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="Username"
            size="large"
            class="custom-input"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="Password"
            size="large"
            class="custom-input"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            :loading="loading" 
            class="login-button"
            @click="handleLogin"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { API_URL } from '@/api'

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const response = await axios.post(`${API_URL}/auth/login`, loginForm)
        const { code, data, message } = response.data
        
        if (code === 200) {
          localStorage.setItem('userInfo', JSON.stringify(data))
          localStorage.setItem('token', data.token)
          ElMessage.success(message || 'Login successful')
          router.push('/')
        } else {
          ElMessage.error(message || 'Login failed')
        }
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || 'Login failed, please try again')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f7f8fa;
}

.login-box {
  width: 100%;
  max-width: 380px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-mark {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 22px;
  font-weight: 700;
  color: white;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.login-form {
  margin-top: 24px;
}

.login-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid #e5e7eb;
  padding: 8px 16px;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: #d1d5db;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: #2563eb;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  border: none;
  border-radius: 8px;
  margin-top: 8px;
}

.login-button:hover {
  opacity: 0.9;
}
</style>
