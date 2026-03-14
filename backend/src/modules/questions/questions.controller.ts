import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { Question } from './question.entity';
import { QuestionOption } from './question-option.entity';
import { ApiResponse as CustomResponse } from '../../common/response';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // ============ 问题 CRUD ============
  
  @Post()
  @ApiOperation({ summary: '创建问题' })
  async createQuestion(@Body() data: Partial<Question>): Promise<CustomResponse<Question>> {
    const question = await this.questionsService.createQuestion(data);
    return CustomResponse.success(question, '创建成功');
  }

  @Get()
  @ApiOperation({ summary: '获取所有问题' })
  async findAllQuestions(): Promise<CustomResponse<Question[]>> {
    const questions = await this.questionsService.findAllQuestions();
    return CustomResponse.success(questions);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取问题详情' })
  @ApiParam({ name: 'id', description: '问题ID' })
  async findQuestionById(@Param('id') id: string): Promise<CustomResponse<Question>> {
    const question = await this.questionsService.findQuestionById(+id);
    if (!question) {
      throw new NotFoundException('问题不存在');
    }
    return CustomResponse.success(question);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新问题' })
  @ApiParam({ name: 'id', description: '问题ID' })
  async updateQuestion(
    @Param('id') id: string,
    @Body() data: Partial<Question>,
  ): Promise<CustomResponse<Question>> {
    const question = await this.questionsService.updateQuestion(+id, data);
    if (!question) {
      throw new NotFoundException('问题不存在');
    }
    return CustomResponse.success(question, '更新成功');
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除问题' })
  @ApiParam({ name: 'id', description: '问题ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuestion(@Param('id') id: string): Promise<CustomResponse<void>> {
    const success = await this.questionsService.deleteQuestion(+id);
    if (!success) {
      throw new NotFoundException('问题不存在');
    }
    return CustomResponse.success(null, '删除成功');
  }

  // ============ 选项 CRUD ============

  @Post('options')
  @ApiOperation({ summary: '创建选项' })
  async createOption(@Body() data: Partial<QuestionOption>): Promise<CustomResponse<QuestionOption>> {
    const option = await this.questionsService.createOption(data);
    return CustomResponse.success(option, '创建成功');
  }

  @Get(':id/options')
  @ApiOperation({ summary: '获取问题的所有选项' })
  @ApiParam({ name: 'id', description: '问题ID' })
  async findOptions(@Param('id') id: string): Promise<CustomResponse<QuestionOption[]>> {
    const options = await this.questionsService.findOptionsByQuestionId(+id);
    return CustomResponse.success(options);
  }

  @Put('options/:optionId')
  @ApiOperation({ summary: '更新选项' })
  @ApiParam({ name: 'optionId', description: '选项ID' })
  async updateOption(
    @Param('optionId') optionId: string,
    @Body() data: Partial<QuestionOption>,
  ): Promise<CustomResponse<QuestionOption>> {
    const option = await this.questionsService.updateOption(+optionId, data);
    if (!option) {
      throw new NotFoundException('选项不存在');
    }
    return CustomResponse.success(option, '更新成功');
  }

  @Delete('options/:optionId')
  @ApiOperation({ summary: '删除选项' })
  @ApiParam({ name: 'optionId', description: '选项ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOption(@Param('optionId') optionId: string): Promise<CustomResponse<void>> {
    const success = await this.questionsService.deleteOption(+optionId);
    if (!success) {
      throw new NotFoundException('选项不存在');
    }
    return CustomResponse.success(null, '删除成功');
  }
}
