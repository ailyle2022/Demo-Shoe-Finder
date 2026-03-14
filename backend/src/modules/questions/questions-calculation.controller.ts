import { 
  Controller, 
  Post, 
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponse as CustomResponse } from '../../common/response';
import { QuestionsService } from './questions.service';
import { ProductsService } from '../products/products.service';

interface Answer {
  [questionId: string]: string;
}

interface ScoredProduct {
  id: number;
  productId: string;
  name: string;
  gender: string;
  shoeType: string;
  scenario: string;
  lastWidth: string;
  runningStage: string;
  positioning: string;
  cushioning: string;
  stability: string;
  sensitivity: string;
  weightHint: string;
  totalScore: number;
  stageScore: number;
  positioningScore: number;
  experienceScore: number;
}

@ApiTags('questions-calculation')
@Controller('questions-calculation')
export class QuestionsCalculationController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '问卷提交计算' })
  async calculate(@Body() answers: Answer): Promise<CustomResponse<ScoredProduct[]>> {
    // 1. 获取用户答案
    const userAnswers = answers;
    
    // 2. 获取所有问题的选项配置
    const questions = await this.questionsService.findAllQuestions();
    
    // 构建选项映射: questionId -> answer -> options
    const optionsMap: Record<number, Record<string, any[]>> = {};
    for (const q of questions) {
      const options = await this.questionsService.findOptionsByQuestionId(q.id);
      optionsMap[q.id] = {};
      for (const opt of options) {
        if (!optionsMap[q.id][opt.answer]) {
          optionsMap[q.id][opt.answer] = [];
        }
        optionsMap[q.id][opt.answer].push(opt);
      }
    }

    // 3. 获取所有商品
    const allProducts = await this.productsService.findAll({ page: 1, pageSize: 100 });
    let products: any[] = allProducts.list;

    // ========== 综合打分 ==========
    const results: ScoredProduct[] = [];
    
    for (const product of products) {
      let stageScore = 0;
      let positioningScore = 0;
      let experienceScore = 0;
      
      // 计算每个问题的得分
      for (const q of questions) {
        const userAnswer = userAnswers[q.id];
        if (!userAnswer) continue;
        
        const userOptions = optionsMap[q.id]?.[userAnswer] || [];
        
        if (q.category === '阶段匹配') {
          // 阶段匹配：检查商品的 runningStage
          let matched = false;
          for (const opt of userOptions) {
            if (opt.field === 'runningStage' && product.runningStage === opt.value) {
              stageScore = opt.score;
              matched = true;
              break;
            }
          }
          if (!matched) stageScore = 50; // 未匹配给基础分
        } else if (q.category === '鞋款定位匹配') {
          // 鞋款定位匹配：检查商品的 positioning
          let matched = false;
          for (const opt of userOptions) {
            if (opt.field === 'positioning' && product.positioning === opt.value) {
              positioningScore = opt.score;
              matched = true;
              break;
            }
          }
          if (!matched) positioningScore = 50;
        } else if (q.category === '体验修正') {
          // 体验修正：体重影响缓震、稳定感、灵敏度
          let matchCount = 0;
          for (const opt of userOptions) {
            if (opt.field === 'cushioning' && product.cushioning === opt.value) {
              experienceScore += opt.score;
              matchCount++;
            } else if (opt.field === 'stability' && product.stability === opt.value) {
              experienceScore += opt.score;
              matchCount++;
            } else if (opt.field === 'sensitivity' && product.sensitivity === opt.value) {
              experienceScore += opt.score;
              matchCount++;
            }
          }
          // 取平均值
          if (matchCount > 0) {
            experienceScore = experienceScore / matchCount;
          } else {
            experienceScore = 50;
          }
        }
      }

      // 归一化到100分制
      const normalizedStage = stageScore;       // 阶段匹配 40%
      const normalizedPositioning = positioningScore; // 鞋款定位 25%
      const normalizedExperience = experienceScore;   // 体验修正 35%
      
      // 加权总分
      const totalScore = normalizedStage * 0.4 + normalizedPositioning * 0.25 + normalizedExperience * 0.35;

      results.push({
        ...product,
        stageScore: normalizedStage,
        positioningScore: normalizedPositioning,
        experienceScore: normalizedExperience,
        totalScore: Math.round(totalScore),
      });
    }

    // 按总分排序
    results.sort((a, b) => b.totalScore - a.totalScore);

    return CustomResponse.success(results);
  }
}
