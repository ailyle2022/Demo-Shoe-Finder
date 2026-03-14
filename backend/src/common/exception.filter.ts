import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException, 
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as any;
        message = resp.message || exception.message;
        error = resp.error || 'Error';
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      // 处理TypeORM等数据库错误
      const errorMessage = exception.message;
      
      if (errorMessage.includes('UNIQUE constraint failed')) {
        status = HttpStatus.CONFLICT;
        message = '数据已存在，请勿重复添加';
        error = 'Conflict';
      } else if (errorMessage.includes('FOREIGN KEY constraint failed')) {
        status = HttpStatus.BAD_REQUEST;
        message = '关联数据不存在';
        error = 'Bad Request';
      } else if (errorMessage.includes('SQLITE_CANTOPEN')) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = '数据库连接失败';
        error = 'Database Error';
      } else {
        message = errorMessage;
      }
      
      // 生产环境不暴露详细错误信息
      this.logger.error(`Error: ${errorMessage}`, exception.stack);
    }

    const errorResponse = {
      code: status,
      message: message,
      error: error,
      timestamp: Date.now(),
    };

    response.status(status).json(errorResponse);
  }
}
