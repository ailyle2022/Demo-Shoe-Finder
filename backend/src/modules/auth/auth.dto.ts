import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: '用户名' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin123', description: '密码' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'newuser', description: '用户名' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'password123', description: '密码' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'user@example.com', description: '邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '新用户', description: '昵称', required: false })
  @IsString()
  nickname?: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 1, description: '用户ID' })
  userId: number;

  @ApiProperty({ example: 'admin', description: '用户名' })
  username: string;

  @ApiProperty({ example: 'admin@example.com', description: '邮箱' })
  email: string;

  @ApiProperty({ example: '管理员', description: '昵称' })
  nickname: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: '访问令牌' })
  token: string;
}
