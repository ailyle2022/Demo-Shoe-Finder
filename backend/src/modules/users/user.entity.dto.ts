import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsEmail, IsOptional, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'admin', description: '用户名' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: '密码' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'admin@example.com', description: '邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '管理员', description: '昵称', required: false })
  @IsOptional()
  @IsString()
  nickname?: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'admin@example.com', description: '邮箱', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '管理员', description: '昵称', required: false })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({ example: 'newpassword123', description: '新密码', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}

export class UserQueryDto {
  @ApiProperty({ example: 1, description: '页码', required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ example: 10, description: '每页数量', required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  pageSize?: number;

  @ApiProperty({ example: '', description: '搜索关键词', required: false })
  @IsOptional()
  @IsString()
  keyword?: string;
}
