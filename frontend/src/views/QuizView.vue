<template>
  <div class="quiz-container">
    <div class="quiz-card">
      <div class="quiz-header">
        <h1>鞋款推荐问卷</h1>
        <p>根据您的回答，为您推荐最适合的跑鞋</p>
      </div>

      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>

      <!-- 提交后的结果 -->
      <div v-else-if="submitted && results.length > 0" class="results-section">
        <div class="results-header">
          <h2>为您推荐以下鞋款</h2>
          <el-button @click="resetQuiz">重新填写</el-button>
        </div>
        
        <div class="results-list">
          <div v-for="(product, index) in results" :key="product.id" class="result-item">
            <div class="result-rank">{{ index + 1 }}</div>
            <div class="result-info">
              <div class="result-name">{{ product.name }}</div>
              <div class="result-details">
                <span>性别: {{ product.gender }}</span>
                <span>类型: {{ product.shoeType }}</span>
                <span>场景: {{ product.scenario }}</span>
              </div>
              <div class="result-scores">
                <span class="score-badge">阶段匹配: {{ product.stageScore }}分</span>
                <span class="score-badge">鞋款定位: {{ product.positioningScore }}分</span>
                <span class="score-badge">体验修正: {{ Math.round(product.experienceScore) }}分</span>
              </div>
            </div>
            <div class="result-total">
              <span class="total-score">{{ product.totalScore }}</span>
              <span class="total-label">综合得分</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="submitted" class="result-card">
        <el-result
          icon="success"
          title="提交成功"
          sub-title="感谢您的参与"
        >
          <template #extra>
            <el-button type="primary" @click="resetQuiz">重新填写</el-button>
          </template>
        </el-result>
      </div>

      <!-- 问题列表 -->
      <div v-else class="questions-list">
        <div v-for="(question, index) in questions" :key="question.id" class="question-item">
          <div class="question-header">
            <span class="question-number">Q{{ index + 1 }}</span>
            <span class="question-text">{{ question.question }}</span>
          </div>
          
          <el-radio-group v-model="answers[question.id]" class="answer-options">
            <el-radio 
              v-for="option in getUniqueAnswers(question.id)" 
              :key="option" 
              :label="option"
              border
              class="answer-radio"
            >
              {{ option }}
            </el-radio>
          </el-radio-group>
        </div>

        <div class="quiz-footer">
          <el-button 
            type="primary" 
            size="large" 
            :loading="submitting"
            :disabled="!isAllAnswered"
            @click="handleSubmit"
          >
            {{ submitting ? '提交中...' : '提交答案' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

const loading = ref(true)
const submitting = ref(false)
const submitted = ref(false)
const questions = ref<any[]>([])
const optionsMap = ref<Record<number, any[]>>({})
const answers = ref<Record<number, string>>({})
const results = ref<any[]>([])

// 获取唯一答案选项
const getUniqueAnswers = (questionId: number) => {
  const options = optionsMap.value[questionId] || []
  const uniqueAnswers = [...new Set(options.map((opt: any) => opt.answer))]
  return uniqueAnswers
}

// 检查是否所有问题都已回答
const isAllAnswered = computed(() => {
  return questions.value.every(q => answers.value[q.id])
})

// 获取问题列表和选项
const fetchQuestions = async () => {
  try {
    loading.value = true
    const response = await axios.get(`${API_URL}/questions`)
    questions.value = response.data.data || []
    
    for (const q of questions.value) {
      const optRes = await axios.get(`${API_URL}/questions/${q.id}/options`)
      optionsMap.value[q.id] = optRes.data.data || []
    }
  } catch (error: any) {
    ElMessage.error('加载问题失败')
  } finally {
    loading.value = false
  }
}

// 提交答案
const handleSubmit = async () => {
  if (!isAllAnswered.value) {
    ElMessage.warning('请回答所有问题')
    return
  }

  try {
    submitting.value = true
    const response = await axios.post(`${API_URL}/questions-calculation`, answers.value)
    results.value = response.data.data || []
    submitted.value = true
    if (results.value.length > 0) {
      ElMessage.success('推荐结果已生成')
    } else {
      ElMessage.warning('没有找到合适的商品')
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '提交失败')
  } finally {
    submitting.value = false
  }
}

// 重置问卷
const resetQuiz = () => {
  submitted.value = false
  results.value = []
  Object.keys(answers.value).forEach(key => {
    delete answers.value[parseInt(key)]
  })
}

onMounted(() => {
  fetchQuestions()
})
</script>

<style scoped>
.quiz-container {
  min-height: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.quiz-card {
  max-width: 800px;
  width: 100%;
}

.quiz-header {
  text-align: center;
  margin-bottom: 40px;
}

.quiz-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.quiz-header p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.loading {
  text-align: center;
  padding: 60px 0;
  color: #6b7280;
}

.loading .el-icon {
  font-size: 32px;
  margin-right: 8px;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.question-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.question-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.question-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  flex-shrink: 0;
}

.question-text {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

.answer-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.answer-options :deep(.el-radio) {
  margin-right: 0;
}

.answer-options :deep(.el-radio.is-bordered) {
  padding: 12px 20px;
  border-radius: 8px;
}

.answer-options :deep(.el-radio.is-bordered.is-checked) {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%);
  border-color: #2563eb;
}

.quiz-footer {
  margin-top: 32px;
  text-align: center;
}

.quiz-footer .el-button {
  padding: 16px 48px;
  font-size: 16px;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  border: none;
  border-radius: 10px;
}

.quiz-footer .el-button:disabled {
  background: #e5e7eb;
}

/* 结果区域 */
.results-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.results-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
}

.result-rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  color: white;
  font-weight: 700;
  font-size: 18px;
  border-radius: 10px;
  flex-shrink: 0;
}

.result-info {
  flex: 1;
}

.result-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.result-details {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}

.result-details span {
  margin-right: 12px;
}

.result-scores {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.score-badge {
  font-size: 12px;
  padding: 2px 8px;
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 4px;
}

.result-total {
  text-align: center;
  min-width: 80px;
}

.total-score {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #2563eb;
}

.total-label {
  font-size: 12px;
  color: #6b7280;
}

.result-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
</style>
