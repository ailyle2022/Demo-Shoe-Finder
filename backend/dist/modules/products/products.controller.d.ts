import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ProductQueryDto } from './product.dto';
import { ApiResponse as CustomResponse } from '../../common/response';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(data: Partial<Product>): Promise<CustomResponse<Product>>;
    findAll(query: ProductQueryDto): Promise<CustomResponse<{
        list: Product[];
        total: number;
    }>>;
    findOne(id: string): Promise<CustomResponse<Product>>;
    update(id: string, data: Partial<Product>): Promise<CustomResponse<Product>>;
    remove(id: string): Promise<CustomResponse<void>>;
}
