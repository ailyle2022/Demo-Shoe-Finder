import { Injectable, NotFoundException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductQueryDto } from './product.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    await this.seedData();
  }

  private async seedData() {
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

  // 创建商品
  async create(data: Partial<Product>): Promise<Product> {
    const existing = await this.productsRepository.findOne({
      where: { productId: data.productId },
    });
    if (existing) {
      throw new ConflictException('商品ID已存在');
    }

    const product = this.productsRepository.create(data);
    return this.productsRepository.save(product);
  }

  // 获取所有商品（支持分页和搜索）
  async findAll(query: ProductQueryDto): Promise<{ list: Product[]; total: number }> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (query.keyword) {
      queryBuilder.where(
        'product.productId LIKE :keyword OR product.name LIKE :keyword OR product.shoeType LIKE :keyword',
        { keyword: `%${query.keyword}%` },
      );
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

  // 根据ID获取商品
  async findById(id: number): Promise<Product | null> {
    return this.productsRepository.findOne({ where: { id } });
  }

  // 更新商品
  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    const product = await this.findById(id);
    if (!product) return null;

    Object.assign(product, data);
    return this.productsRepository.save(product);
  }

  // 删除商品
  async remove(id: number): Promise<boolean> {
    const result = await this.productsRepository.delete(id);
    return (result.affected || 0) > 0;
  }
}
