import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductQueryDto } from './product.dto';
export declare class ProductsService implements OnModuleInit {
    private productsRepository;
    constructor(productsRepository: Repository<Product>);
    onModuleInit(): Promise<void>;
    private seedData;
    create(data: Partial<Product>): Promise<Product>;
    findAll(query: ProductQueryDto): Promise<{
        list: Product[];
        total: number;
    }>;
    findById(id: number): Promise<Product | null>;
    update(id: number, data: Partial<Product>): Promise<Product | null>;
    remove(id: number): Promise<boolean>;
}
