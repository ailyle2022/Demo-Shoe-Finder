import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE === 'sqlite' ? 'sqlite' : 'postgres',
      database: process.env.DB_TYPE === 'sqlite' ? 'demo.db' : process.env.DB_NAME || 'demo',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
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
