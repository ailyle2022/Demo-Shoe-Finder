import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用CORS
  app.enableCors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true,
  });
  
  // 设置全局前缀
  app.setGlobalPrefix('api');

  // 启用验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // 全局异常过滤器
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 配置Swagger
  const config = new DocumentBuilder()
    .setTitle('Demo API')
    .setDescription('Demo项目后端API文档')
    .setVersion('1.0')
    .addServer('http://localhost:3000', '开发环境')
    .addTag('auth', '认证相关接口')
    .addTag('users', '用户管理接口')
    .addTag('products', '商品管理接口')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log('Backend is running on: http://localhost:3000');
  console.log('Swagger文档: http://localhost:3000/api-docs');
}
bootstrap();
