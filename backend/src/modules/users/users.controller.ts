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
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './user.entity.dto';
import { ApiResponse as CustomResponse } from '../../common/response';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiResponse({ status: 201, description: '用户创建成功' })
  @ApiResponse({ status: 409, description: '用户名或邮箱已存在' })
  async create(@Body() createUserDto: CreateUserDto): Promise<CustomResponse<User>> {
    const user = await this.usersService.create(createUserDto);
    const { password, ...result } = user;
    return CustomResponse.success(result as User, '用户创建成功');
  }

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  async findAll(@Query() query: UserQueryDto): Promise<CustomResponse<{ list: User[]; total: number }>> {
    const result = await this.usersService.findAll(query);
    // 移除密码
    result.list = result.list.map(({ password, ...user }) => user as User);
    return CustomResponse.success(result);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户详情' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async findOne(@Param('id') id: string): Promise<CustomResponse<User>> {
    const user = await this.usersService.findById(+id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const { password, ...result } = user;
    return CustomResponse.success(result as User);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<CustomResponse<User>> {
    const user = await this.usersService.update(+id, updateUserDto);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const { password, ...result } = user;
    return CustomResponse.success(result as User, '用户更新成功');
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: '用户ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<CustomResponse<void>> {
    const success = await this.usersService.remove(+id);
    if (!success) {
      throw new NotFoundException('用户不存在');
    }
    return CustomResponse.success(null, '用户删除成功');
  }
}
