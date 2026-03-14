import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Railway: use PORT env var, default to 3000
  const port = process.env.PORT || 3000;
  
  // 启用CORS - allow all in production
  app.enableCors({
    origin: true,
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
    .addServer(`http://localhost:${port}`, '开发环境')
    .addTag('auth', '认证相关接口')
    .addTag('users', '用户管理接口')
    .addTag('products', '商品管理接口')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  console.log(`Backend is running on: http://localhost:${port}`);
  console.log(`Swagger文档: http://localhost:${port}/api-docs`);
}
bootstrap();
