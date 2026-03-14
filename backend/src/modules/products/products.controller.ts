import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ProductQueryDto } from './product.dto';
import { ApiResponse as CustomResponse } from '../../common/response';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: '创建商品' })
  @ApiResponse({ status: 201, description: '商品创建成功' })
  @ApiResponse({ status: 409, description: '商品ID已存在' })
  async create(@Body() data: Partial<Product>): Promise<CustomResponse<Product>> {
    const product = await this.productsService.create(data);
    return CustomResponse.success(product, '商品创建成功');
  }

  @Get()
  @ApiOperation({ summary: '获取商品列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  async findAll(@Query() query: ProductQueryDto): Promise<CustomResponse<{ list: Product[]; total: number }>> {
    const result = await this.productsService.findAll(query);
    return CustomResponse.success(result);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取商品详情' })
  @ApiParam({ name: 'id', description: '商品ID' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  async findOne(@Param('id') id: string): Promise<CustomResponse<Product>> {
    const product = await this.productsService.findById(+id);
    if (!product) {
      throw new NotFoundException('商品不存在');
    }
    return CustomResponse.success(product);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新商品信息' })
  @ApiParam({ name: 'id', description: '商品ID' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  async update(
    @Param('id') id: string,
    @Body() data: Partial<Product>,
  ): Promise<CustomResponse<Product>> {
    const product = await this.productsService.update(+id, data);
    if (!product) {
      throw new NotFoundException('商品不存在');
    }
    return CustomResponse.success(product, '商品更新成功');
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除商品' })
  @ApiParam({ name: 'id', description: '商品ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<CustomResponse<void>> {
    const success = await this.productsService.remove(+id);
    if (!success) {
      throw new NotFoundException('商品不存在');
    }
    return CustomResponse.success(null, '商品删除成功');
  }
}
