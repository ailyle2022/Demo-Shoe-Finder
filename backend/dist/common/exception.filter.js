"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = '服务器内部错误';
        let error = 'Internal Server Error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object') {
                const resp = exceptionResponse;
                message = resp.message || exception.message;
                error = resp.error || 'Error';
            }
            else {
                message = exceptionResponse;
            }
        }
        else if (exception instanceof Error) {
            const errorMessage = exception.message;
            if (errorMessage.includes('UNIQUE constraint failed')) {
                status = common_1.HttpStatus.CONFLICT;
                message = '数据已存在，请勿重复添加';
                error = 'Conflict';
            }
            else if (errorMessage.includes('FOREIGN KEY constraint failed')) {
                status = common_1.HttpStatus.BAD_REQUEST;
                message = '关联数据不存在';
                error = 'Bad Request';
            }
            else if (errorMessage.includes('SQLITE_CANTOPEN')) {
                status = common_1.HttpStatus.SERVICE_UNAVAILABLE;
                message = '数据库连接失败';
                error = 'Database Error';
            }
            else {
                message = errorMessage;
            }
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
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=exception.filter.js.map