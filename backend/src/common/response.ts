import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T = any> {
  @ApiProperty({ example: 200, description: '状态码' })
  code: number;

  @ApiProperty({ example: '成功', description: '消息' })
  message: string;

  @ApiProperty({ description: '数据' })
  data: T;

  @ApiProperty({ example: 1773470705000, description: '时间戳' })
  timestamp: number;

  constructor(code: number = 200, message: string = '成功', data: T = null) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = Date.now();
  }

  static success<T>(data: T, message: string = '成功'): ApiResponse<T> {
    return new ApiResponse(200, message, data);
  }

  static error(message: string, code: number = 500): ApiResponse {
    return new ApiResponse(code, message, null);
  }
}
