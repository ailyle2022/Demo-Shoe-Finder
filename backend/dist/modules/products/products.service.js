"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductsService = class ProductsService {
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async onModuleInit() {
        await this.seedData();
    }
    async seedData() {
        const count = await this.productsRepository.count();
        if (count === 0) {
            const products = [
                { productId: 'ON-001', name: 'Cloud 5', gender: '男', shoeType: '路跑鞋', scenario: '城市路跑', lastWidth: '标准', runningStage: '入门', positioning: '日常训练', cushioning: '中', stability: '中', sensitivity: '中', weightHint: '通用' },
                { productId: 'ON-002', name: 'Cloudmonster', gender: '男', shoeType: '路跑鞋', scenario: '城市路跑', lastWidth: '标准', runningStage: '进阶', positioning: '缓震取向', cushioning: '高', stability: '中', sensitivity: '中', weightHint: '偏重' },
                { productId: 'ON-003', name: 'Cloudflow', gender: '女', shoeType: '路跑鞋', scenario: '城市路跑', lastWidth: '窄', runningStage: '进阶', positioning: '性能取向', cushioning: '中', stability: '低', sensitivity: '高', weightHint: '偏轻' },
                { productId: 'ON-004', name: 'Cloudstratus', gender: '男', shoeType: '路跑鞋', scenario: '城市路跑', lastWidth: '标准', runningStage: '进阶', positioning: '日常训练', cushioning: '高', stability: '高', sensitivity: '低', weightHint: '偏重' },
                { productId: 'ON-005', name: 'Cloudboom Echo', gender: '男', shoeType: '路跑鞋', scenario: '城市路跑', lastWidth: '窄', runningStage: '备赛', positioning: '性能取向', cushioning: '中', stability: '低', sensitivity: '高', weightHint: '偏轻' },
            ];
            for (const p of products) {
                const product = this.productsRepository.create(p);
                await this.productsRepository.save(product);
            }
            console.log('Products seeded successfully');
        }
    }
    async create(data) {
        const existing = await this.productsRepository.findOne({
            where: { productId: data.productId },
        });
        if (existing) {
            throw new common_1.ConflictException('商品ID已存在');
        }
        const product = this.productsRepository.create(data);
        return this.productsRepository.save(product);
    }
    async findAll(query) {
        const queryBuilder = this.productsRepository.createQueryBuilder('product');
        if (query.keyword) {
            queryBuilder.where('product.productId LIKE :keyword OR product.name LIKE :keyword OR product.shoeType LIKE :keyword', { keyword: `%${query.keyword}%` });
        }
        const total = await queryBuilder.getCount();
        const page = query.page || 1;
        const pageSize = query.pageSize || 10;
        const list = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
        return { list, total };
    }
    async findById(id) {
        return this.productsRepository.findOne({ where: { id } });
    }
    async update(id, data) {
        const product = await this.findById(id);
        if (!product)
            return null;
        Object.assign(product, data);
        return this.productsRepository.save(product);
    }
    async remove(id) {
        const result = await this.productsRepository.delete(id);
        return (result.affected || 0) > 0;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map