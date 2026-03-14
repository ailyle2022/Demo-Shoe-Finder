import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ProductQueryDto {
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
