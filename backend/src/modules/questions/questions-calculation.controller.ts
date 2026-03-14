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

    // ========== 第一步：筛选过滤层（硬匹配）==========
    // 需要过滤的字段
    let userShoeType = '';   // 鞋款类型
    let userScenario = '';    // 适用场景
    let userGender = '';      // 性别（暂忽略）
    let userLastWidth = '';   // 楦型宽度（暂忽略）
    
    for (const q of questions) {
      const userAnswer = userAnswers[q.id];
      if (!userAnswer) continue;
      
      // 获取用户答案对应的选项配置（使用选项的value字段）
      const userOptions = optionsMap[q.id]?.[userAnswer] || [];
      const firstOption = userOptions[0];
      
      if (q.category === '鞋款类型匹配' && firstOption) {
        userShoeType = firstOption.value;  // 使用选项的value
      } else if (q.category === '适用场景匹配' && firstOption) {
        userScenario = firstOption.value;  // 使用选项的value
      } else if (q.category === '性别匹配') {
        userGender = userAnswer;
      } else if (q.category === '楦型宽度匹配') {
        userLastWidth = userAnswer;
      }
    }

    // 硬匹配过滤
    const filteredProducts = products.filter(product => {
      // 1. 鞋款类型过滤（硬匹配）
      if (userShoeType) {
        // 商品的鞋款类型必须匹配用户选择的
        if (product.shoeType !== userShoeType) {
          return false; // 鞋款类型不匹配，过滤掉
        }
      }

      // 2. 适用场景过滤（硬匹配）
      if (userScenario) {
        // 商品的场景需要匹配
        if (product.scenario !== userScenario) {
          return false; // 适用场景不匹配，过滤掉
        }
      }

      // 3. 性别过滤（暂忽略）

      // 4. 楦型宽度过滤（暂忽略）

      return true; // 通过所有过滤
    });

    // 如果过滤后没有商品，返回空列表
    if (filteredProducts.length === 0) {
      return CustomResponse.success([]);
    }

    // ========== 第二步：综合打分 ==========
    const results: ScoredProduct[] = [];
    
    for (const product of filteredProducts) {
      let stageScore = 0;
      let positioningScore = 0;
      let experienceScore = 0;
      
      // 计算每个问题的得分
      for (const q of questions) {
        const userAnswer = userAnswers[q.id];
        if (!userAnswer) continue;
        
        // 过滤层的问题不参与打分
        if (q.category === '鞋款类型匹配' || q.category === '适用场景匹配' || 
            q.category === '性别匹配' || q.category === '楦型宽度匹配') {
          continue;
        }
        
        // 获取用户答案对应的选项配置
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
