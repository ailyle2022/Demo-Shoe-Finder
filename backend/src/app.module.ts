import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { User } from './modules/users/user.entity';
import { Product } from './modules/products/product.entity';
import { Question } from './modules/questions/question.entity';
import { QuestionOption } from './modules/questions/question-option.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'demo.db',
      entities: [User, Product, Question, QuestionOption],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    QuestionsModule,
  ],
})
export class AppModule {}
