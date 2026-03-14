import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, LoginResponseDto } from './auth.dto';
import { ApiResponse as CustomResponse } from '../../common/response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ 
    status: 200, 
    description: '登录成功',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  async login(@Body() loginDto: LoginDto): Promise<CustomResponse<LoginResponseDto>> {
    const result = await this.authService.login(loginDto);
    return CustomResponse.success(result, '登录成功');
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ 
    status: 201, 
    description: '注册成功',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 409, description: '用户名已存在' })
  async register(@Body() registerDto: RegisterDto): Promise<CustomResponse<LoginResponseDto>> {
    const result = await this.authService.register(registerDto);
    return CustomResponse.success(result, '注册成功');
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登出' })
  @ApiHeader({ name: 'Authorization', description: '访问令牌', required: true })
  @ApiResponse({ status: 200, description: '登出成功' })
  logout(@Headers('authorization') authHeader: string): CustomResponse<void> {
    const token = authHeader.replace('Bearer ', '');
    this.authService.logout(token);
    return CustomResponse.success(null, '登出成功');
  }
}
