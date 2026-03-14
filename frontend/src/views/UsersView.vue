<template>
  <div class="users-container">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="Search users..."
        class="search-input"
        clearable
        @input="handleSearch"
      />
      <el-button type="primary" class="add-btn" @click="handleAdd">
        + Add User
      </el-button>
    </div>

    <!-- 用户列表 -->
    <div class="table-container">
      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="Username" min-width="120" />
        <el-table-column prop="email" label="Email" min-width="180" />
        <el-table-column prop="nickname" label="Nickname" min-width="120" />
        <el-table-column label="Created" min-width="150">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" fixed="right" width="140">
          <template #default="{ row }">
            <el-button size="small" link type="primary" @click="handleEdit(row)">
              Edit
            </el-button>
            <el-button size="small" link type="danger" @click="handleDelete(row)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <span class="total">Total {{ total }} users</span>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Edit User' : 'Add User'"
      width="440px"
      :close-on-click-modal="false"
    >
      <el-form ref="userFormRef" :model="userForm" :rules="rules" label-width="80px" class="user-form">
        <el-form-item label="Username" prop="username">
          <el-input v-model="userForm.username" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="userForm.password" type="password" show-password :placeholder="isEdit ? 'Leave blank to keep current' : ''" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="Nickname" prop="nickname">
          <el-input v-model="userForm.nickname" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ isEdit ? 'Update' : 'Create' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import axios from 'axios'
import { API_URL } from '@/api'

// 列表数据
const userList = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')

// 对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const userFormRef = ref<FormInstance>()
const editingId = ref<number | null>(null)

const userForm = reactive({
  username: '',
  password: '',
  email: '',
  nickname: ''
})

const rules: FormRules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' }
  ],
  password: [
    { required: !isEdit.value, message: 'Please enter password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Please enter valid email', trigger: 'blur' }
  ]
}

// 获取用户列表
const fetchUsers = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    }
    const response = await axios.get(`${API_URL}/users`, { params })
    const { code, data } = response.data
    if (code === 200) {
      userList.value = data.list
      total.value = data.total
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || 'Failed to fetch users')
  }
}

// 搜索
let searchTimer: any = null
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchUsers()
  }, 300)
}

// 分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchUsers()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchUsers()
}

// 添加用户
const handleAdd = () => {
  isEdit.value = false
  editingId.value = null
  userForm.username = ''
  userForm.password = ''
  userForm.email = ''
  userForm.nickname = ''
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row: any) => {
  isEdit.value = true
  editingId.value = row.id
  userForm.username = row.username
  userForm.password = ''
  userForm.email = row.email
  userForm.nickname = row.nickname
  dialogVisible.value = true
}

// 删除用户
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure to delete user "${row.username}"?`,
      'Warning',
      { type: 'warning' }
    )
    
    await axios.delete(`${API_URL}/users/${row.id}`)
    ElMessage.success('User deleted successfully')
    fetchUsers()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || 'Failed to delete user')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!userFormRef.value) return
  
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true
      try {
        if (isEdit.value) {
          const updateData: any = {}
          if (userForm.email) updateData.email = userForm.email
          if (userForm.nickname) updateData.nickname = userForm.nickname
          if (userForm.password) updateData.password = userForm.password
          
          await axios.put(`${API_URL}/users/${editingId.value}`, updateData)
          ElMessage.success('User updated successfully')
        } else {
          await axios.post(`${API_URL}/users`, userForm)
          ElMessage.success('User created successfully')
        }
        dialogVisible.value = false
        fetchUsers()
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || 'Operation failed')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString()
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.users-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-input {
  width: 240px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
}

.add-btn {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  border: none;
  border-radius: 8px;
}

.table-container {
  margin-bottom: 16px;
}

.table-container :deep(.el-table th) {
  background: #f9fafb;
  font-weight: 500;
  color: #374151;
}

.table-container :deep(.el-table td) {
  padding: 14px 0;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-size: 13px;
  color: #6b7280;
}

.user-form :deep(.el-input__wrapper) {
  border-radius: 8px;
}
</style>
