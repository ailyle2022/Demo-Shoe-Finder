import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionsCalculationController } from './questions-calculation.controller';
import { Question } from './question.entity';
import { QuestionOption } from './question-option.entity';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionOption]),
    ProductsModule,
  ],
  providers: [QuestionsService],
  controllers: [QuestionsController, QuestionsCalculationController],
  exports: [QuestionsService],
})
export class QuestionsModule {}
