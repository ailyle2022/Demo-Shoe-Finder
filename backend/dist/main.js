"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const exception_filter_1 = require("./common/exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.useGlobalFilters(new exception_filter_1.GlobalExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Demo API')
        .setDescription('Demo项目后端API文档')
        .setVersion('1.0')
        .addServer('http://localhost:3000', '开发环境')
        .addTag('auth', '认证相关接口')
        .addTag('users', '用户管理接口')
        .addTag('products', '商品管理接口')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(3000);
    console.log('Backend is running on: http://localhost:3000');
    console.log('Swagger文档: http://localhost:3000/api-docs');
}
bootstrap();
//# sourceMappingURL=main.js.map