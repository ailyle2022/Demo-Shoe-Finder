<template>
  <div class="products-container">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索商品..."
        class="search-input"
        clearable
        @input="handleSearch"
      />
      <el-button type="primary" class="add-btn" @click="handleAdd">
        + 添加商品
      </el-button>
    </div>

    <!-- 商品列表 -->
    <div class="table-container">
      <el-table :data="productList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="productId" label="商品ID" min-width="100" />
        <el-table-column prop="name" label="商品名称" min-width="150" />
        <el-table-column prop="gender" label="性别" min-width="80" />
        <el-table-column prop="shoeType" label="鞋款类型" min-width="100" />
        <el-table-column prop="scenario" label="适用场景" min-width="120" />
        <el-table-column label="操作" fixed="right" width="140">
          <template #default="{ row }">
            <el-button size="small" link type="primary" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button size="small" link type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <span class="total">共 {{ total }} 条</span>
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
      :title="isEdit ? '编辑商品' : '添加商品'"
      width="600px"
      :close-on-click-modal="false"
      @open="onDialogOpen"
    >
      <el-form ref="productFormRef" :model="productForm" label-width="100px">
        <el-form-item label="商品ID" prop="productId">
          <el-input v-model="productForm.productId" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="productForm.name" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="productForm.gender" placeholder="请选择" style="width: 100%">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="鞋款类型" prop="shoeType">
          <el-input v-model="productForm.shoeType" />
        </el-form-item>
        <el-form-item label="适用场景" prop="scenario">
          <el-input v-model="productForm.scenario" />
        </el-form-item>
        <el-form-item label="楦型宽度" prop="lastWidth">
          <el-select v-model="productForm.lastWidth" placeholder="请选择" style="width: 100%">
            <el-option label="标准" value="标准" />
            <el-option label="窄" value="窄" />
            <el-option label="宽" value="宽" />
          </el-select>
        </el-form-item>
        <el-form-item label="跑步阶段" prop="runningStage">
          <el-select v-model="productForm.runningStage" placeholder="请选择" style="width: 100%">
            <el-option label="入门" value="入门" />
            <el-option label="进阶" value="进阶" />
            <el-option label="备赛" value="备赛" />
          </el-select>
        </el-form-item>
        <el-form-item label="鞋款定位" prop="positioning">
          <el-select v-model="productForm.positioning" placeholder="请选择" style="width: 100%">
            <el-option label="日常训练" value="日常训练" />
            <el-option label="缓震取向" value="缓震取向" />
            <el-option label="性能取向" value="性能取向" />
          </el-select>
        </el-form-item>
        <el-form-item label="缓震等级" prop="cushioning">
          <el-select v-model="productForm.cushioning" placeholder="请选择" style="width: 100%">
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item label="稳定感" prop="stability">
          <el-select v-model="productForm.stability" placeholder="请选择" style="width: 100%">
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item label="灵敏度" prop="sensitivity">
          <el-select v-model="productForm.sensitivity" placeholder="请选择" style="width: 100%">
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item label="体重适配" prop="weightHint">
          <el-input v-model="productForm.weightHint" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import axios from 'axios'
import { API_URL } from '@/api'

// 列表数据
const productList = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const searchKeyword = ref('')

// 对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const productFormRef = ref<FormInstance>()
const editingId = ref<number | null>(null)

const productForm = reactive({
  productId: '',
  name: '',
  gender: '',
  shoeType: '',
  scenario: '',
  lastWidth: '',
  runningStage: '',
  positioning: '',
  cushioning: '',
  stability: '',
  sensitivity: '',
  weightHint: ''
})

// 获取商品列表
const fetchProducts = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    }
    const response = await axios.get(`${API_URL}/products`, { params })
    const { code, data } = response.data
    if (code === 200) {
      productList.value = data.list
      total.value = data.total
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '获取商品列表失败')
  }
}

// 搜索
let searchTimer: any = null
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchProducts()
  }, 300)
}

// 分页
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchProducts()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchProducts()
}

// 对话框打开时
const onDialogOpen = () => {
  if (!isEdit.value) {
    // 添加时清空表单
    Object.keys(productForm).forEach(key => {
      (productForm as any)[key] = ''
    })
  }
}

// 添加商品
const handleAdd = () => {
  isEdit.value = false
  editingId.value = null
  dialogVisible.value = true
}

// 编辑商品
const handleEdit = (row: any) => {
  isEdit.value = true
  editingId.value = row.id
  // 复制行数据到表单
  Object.keys(productForm).forEach(key => {
    (productForm as any)[key] = row[key] || ''
  })
  dialogVisible.value = true
}

// 删除商品
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定删除商品 "${row.name}" 吗？`,
      '警告',
      { type: 'warning' }
    )
    
    await axios.delete(`${API_URL}/products/${row.id}`)
    ElMessage.success('商品删除成功')
    fetchProducts()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除商品失败')
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!productFormRef.value) return
  
  submitLoading.value = true
  try {
    // 过滤空字符串
    const data: any = {}
    Object.keys(productForm).forEach(key => {
      const value = (productForm as any)[key]
      data[key] = value === '' ? null : value
    })
    
    if (isEdit.value) {
      await axios.put(`${API_URL}/products/${editingId.value}`, data)
      ElMessage.success('商品更新成功')
    } else {
      await axios.post(`${API_URL}/products`, data)
      ElMessage.success('商品创建成功')
    }
    dialogVisible.value = false
    fetchProducts()
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '操作失败')
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.products-container {
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
  padding: 12px 0;
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
</style>
