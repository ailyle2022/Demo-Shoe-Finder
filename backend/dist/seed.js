"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./modules/products/product.entity");
const user_entity_1 = require("./modules/users/user.entity");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    const userRepo = dataSource.getRepository(user_entity_1.User);
    const adminExists = await userRepo.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
        await userRepo.save({
            username: 'admin',
            password: 'admin123',
            email: 'admin@example.com',
            nickname: '管理员',
        });
        console.log('Admin user created');
    }
    const productRepo = dataSource.getRepository(product_entity_1.Product);
    const products = [
        { productId: 'ON-001', name: 'Cloud 5', gender: '男', shoeType: '路跑鞋', scenario: '城市路跑', lastWidth: '标准', runningStage: '入门', positioning: '日常训练', cushioning: '中', stability: '中', sensitivity: '中', weightHint: '通用' },
        { productId: 'ON-002', name: 'Cloudmonster', gender: '男', shoeType: '路跑鞋', scenario: '城市路跑', lastWidth: '标准', runningStage: '进阶', positioning: '缓震取向', cushioning: '高', stability: '中', sensitivity: '中', weightHint: '偏重' },
        { productId: 'ON-003', name: 'Cloudflow', gender: '女', shoeType: '路跑鞋', scenario: '城市路跑', lastWidth: '窄', runningStage: '进阶', positioning: '性能取向', cushioning: '中', stability: '低', sensitivity: '高', weightHint: '偏轻' },
        { productId: 'ON-004', name: 'Cloudstratus', gender: '男', shoeType: '路跑鞋', scenario: '城市路跑', lastWidth: '标准', runningStage: '进阶', positioning: '日常训练', cushioning: '高', stability: '高', sensitivity: '低', weightHint: '偏重' },
        { productId: 'ON-005', name: 'Cloudboom Echo', gender: '男', shoeType: '路跑鞋', scenario: '城市路跑', lastWidth: '窄', runningStage: '备赛', positioning: '性能取向', cushioning: '中', stability: '低', sensitivity: '高', weightHint: '偏轻' },
    ];
    for (const p of products) {
        const exists = await productRepo.findOne({ where: { productId: p.productId } });
        if (!exists) {
            await productRepo.save(p);
            console.log('Product created:', p.productId);
        }
    }
    console.log('Data initialization complete');
    process.exit(0);
}
bootstrap();
//# sourceMappingURL=seed.js.map