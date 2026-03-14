<template>
  <div class="questions-container">
    <!-- 搜索和操作栏 -->
    <div class="toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索问题..."
        class="search-input"
        clearable
        @input="handleSearch"
      />
      <el-button type="primary" class="add-btn" @click="handleAddQuestion">
        + 添加问题
      </el-button>
    </div>

    <!-- 问题列表 -->
    <div class="table-container">
      <el-table :data="questionList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="question" label="问题" min-width="300" />
        <el-table-column prop="category" label="分类" min-width="120" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column label="选项数" width="80">
          <template #default="{ row }">
            {{ getOptionCount(row.id) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button size="small" link type="primary" @click="handleEditQuestion(row)">
              编辑
            </el-button>
            <el-button size="small" link type="primary" @click="handleManageOptions(row)">
              选项
            </el-button>
            <el-button size="small" link type="danger" @click="handleDeleteQuestion(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 问题对话框 -->
    <el-dialog
      v-model="questionDialogVisible"
      :title="isEditQuestion ? '编辑问题' : '添加问题'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="questionFormRef" :model="questionForm" label-width="80px">
        <el-form-item label="问题" prop="question">
          <el-input v-model="questionForm.question" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-input v-model="questionForm.category" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="questionForm.description" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="questionDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmitQuestion">
          {{ isEditQuestion ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 选项管理对话框 -->
    <el-dialog
      v-model="optionsDialogVisible"
      :title="`管理选项 - ${currentQuestion?.question}`"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="options-toolbar">
        <el-button type="primary" size="small" @click="handleAddOption">
          + 添加选项
        </el-button>
      </div>
      <el-table :data="optionList" style="width: 100%; margin-top: 10px">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="answer" label="用户答案" min-width="100" />
        <el-table-column prop="dimension" label="影响维度" min-width="100" />
        <el-table-column prop="field" label="商品字段" min-width="100" />
        <el-table-column prop="value" label="字段值" min-width="100" />
        <el-table-column prop="score" label="分值" width="80" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="{ row }">
            <el-button size="small" link type="primary" @click="handleEditOption(row)">
              编辑
            </el-button>
            <el-button size="small" link type="danger" @click="handleDeleteOption(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 选项对话框 -->
    <el-dialog
      v-model="optionDialogVisible"
      :title="isEditOption ? '编辑选项' : '添加选项'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="optionFormRef" :model="optionForm" label-width="100px">
        <el-form-item label="用户答案" prop="answer">
          <el-input v-model="optionForm.answer" />
        </el-form-item>
        <el-form-item label="影响维度" prop="dimension">
          <el-input v-model="optionForm.dimension" />
        </el-form-item>
        <el-form-item label="商品字段" prop="field">
          <el-select v-model="optionForm.field" placeholder="请选择" style="width: 100%">
            <el-option label="跑步阶段" value="runningStage" />
            <el-option label="鞋款定位" value="positioning" />
            <el-option label="缓震等级" value="cushioning" />
            <el-option label="稳定感" value="stability" />
            <el-option label="灵敏度" value="sensitivity" />
          </el-select>
        </el-form-item>
        <el-form-item label="字段值" prop="value">
          <el-input v-model="optionForm.value" />
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input-number v-model="optionForm.score" :min="-100" :max="200" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="optionDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmitOption">
          {{ isEditOption ? '更新' : '创建' }}
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

const API_URL = 'http://localhost:3000/api'

// 列表数据
const questionList = ref<any[]>([])
const optionList = ref<any[]>([])
const optionCountMap = ref<Record<number, number>>({})
const searchKeyword = ref('')

// 问题对话框
const questionDialogVisible = ref(false)
const isEditQuestion = ref(false)
const submitLoading = ref(false)
const questionFormRef = ref<FormInstance>()
const editingQuestionId = ref<number | null>(null)
const currentQuestion = ref<any>(null)

const questionForm = reactive({
  question: '',
  category: '',
  description: ''
})

// 选项对话框
const optionsDialogVisible = ref(false)
const optionDialogVisible = ref(false)
const isEditOption = ref(false)
const optionFormRef = ref<FormInstance>()
const editingOptionId = ref<number | null>(null)

const optionForm = reactive({
  answer: '',
  dimension: '',
  field: '',
  value: '',
  score: 100
})

// 获取问题列表
const fetchQuestions = async () => {
  try {
    const response = await axios.get(`${API_URL}/questions`)
    const { code, data } = response.data
    if (code === 200) {
      questionList.value = data
      // 获取每个问题的选项数
      for (const q of data) {
        const optRes = await axios.get(`${API_URL}/questions/${q.id}/options`)
        optionCountMap.value[q.id] = optRes.data.data?.length || 0
      }
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '获取问题列表失败')
  }
}

const getOptionCount = (questionId: number) => {
  return optionCountMap.value[questionId] || 0
}

// 搜索
let searchTimer: any = null
const handleSearch = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    fetchQuestions()
  }, 300)
}

// 问题操作
const handleAddQuestion = () => {
  isEditQuestion.value = false
  editingQuestionId.value = null
  questionForm.question = ''
  questionForm.category = ''
  questionForm.description = ''
  questionDialogVisible.value = true
}

const handleEditQuestion = (row: any) => {
  isEditQuestion.value = true
  editingQuestionId.value = row.id
  questionForm.question = row.question
  questionForm.category = row.category
  questionForm.description = row.description || ''
  questionDialogVisible.value = true
}

const handleSubmitQuestion = async () => {
  if (!questionFormRef.value) return
  
  submitLoading.value = true
  try {
    if (isEditQuestion.value) {
      await axios.put(`${API_URL}/questions/${editingQuestionId.value}`, questionForm)
      ElMessage.success('更新成功')
    } else {
      await axios.post(`${API_URL}/questions`, questionForm)
      ElMessage.success('创建成功')
    }
    questionDialogVisible.value = false
    fetchQuestions()
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '操作失败')
  } finally {
    submitLoading.value = false
  }
}

const handleDeleteQuestion = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定删除问题 "${row.question}" 吗？`, '警告', { type: 'warning' })
    await axios.delete(`${API_URL}/questions/${row.id}`)
    ElMessage.success('删除成功')
    fetchQuestions()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }
}

// 选项操作
const handleManageOptions = async (row: any) => {
  currentQuestion.value = row
  optionsDialogVisible.value = true
  await fetchOptions(row.id)
}

const fetchOptions = async (questionId: number) => {
  try {
    const response = await axios.get(`${API_URL}/questions/${questionId}/options`)
    optionList.value = response.data.data || []
  } catch (error: any) {
    ElMessage.error('获取选项失败')
  }
}

const handleAddOption = () => {
  isEditOption.value = false
  editingOptionId.value = null
  optionForm.answer = ''
  optionForm.dimension = currentQuestion.value?.category || ''
  optionForm.field = ''
  optionForm.value = ''
  optionForm.score = 100
  optionDialogVisible.value = true
}

const handleEditOption = (row: any) => {
  isEditOption.value = true
  editingOptionId.value = row.id
  optionForm.answer = row.answer
  optionForm.dimension = row.dimension
  optionForm.field = row.field
  optionForm.value = row.value
  optionForm.score = row.score
  optionDialogVisible.value = true
}

const handleSubmitOption = async () => {
  if (!optionFormRef.value) return
  
  submitLoading.value = true
  try {
    const data = { ...optionForm, questionId: currentQuestion.value.id }
    if (isEditOption.value) {
      await axios.put(`${API_URL}/questions/options/${editingOptionId.value}`, optionForm)
      ElMessage.success('更新成功')
    } else {
      await axios.post(`${API_URL}/questions/options`, data)
      ElMessage.success('创建成功')
    }
    optionDialogVisible.value = false
    await fetchOptions(currentQuestion.value.id)
    fetchQuestions()
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '操作失败')
  } finally {
    submitLoading.value = false
  }
}

const handleDeleteOption = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定删除选项 "${row.answer}" 吗？`, '警告', { type: 'warning' })
    await axios.delete(`${API_URL}/questions/options/${row.id}`)
    ElMessage.success('删除成功')
    await fetchOptions(currentQuestion.value.id)
    fetchQuestions()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }
}

onMounted(() => {
  fetchQuestions()
})
</script>

<style scoped>
.questions-container {
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

.options-toolbar {
  margin-bottom: 10px;
}
</style>
