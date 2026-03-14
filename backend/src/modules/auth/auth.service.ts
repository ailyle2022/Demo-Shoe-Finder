import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, LoginResponseDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  // 登录
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    // 验证用户是否存在
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 验证密码
    const isPasswordValid = await this.usersService.validatePassword(username, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 生成简单的token
    const token = this.generateToken(username);

    return {
      userId: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      token,
    };
  }

  // 注册
  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    const { username, password, email, nickname } = registerDto;

    // 创建用户
    const newUser = await this.usersService.create({
      username,
      password,
      email,
      nickname,
    });

    // 生成token
    const token = this.generateToken(username);

    return {
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      nickname: newUser.nickname,
      token,
    };
  }

  // 生成简单的token
  private generateToken(username: string): string {
    const payload = {
      username,
      timestamp: Date.now(),
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  // 登出
  logout(token: string): void {
    // SQLite版本不需要处理token存储
  }
}
