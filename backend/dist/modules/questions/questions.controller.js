"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const questions_service_1 = require("./questions.service");
const response_1 = require("../../common/response");
let QuestionsController = class QuestionsController {
    constructor(questionsService) {
        this.questionsService = questionsService;
    }
    async createQuestion(data) {
        const question = await this.questionsService.createQuestion(data);
        return response_1.ApiResponse.success(question, '创建成功');
    }
    async findAllQuestions() {
        const questions = await this.questionsService.findAllQuestions();
        return response_1.ApiResponse.success(questions);
    }
    async findQuestionById(id) {
        const question = await this.questionsService.findQuestionById(+id);
        if (!question) {
            throw new common_1.NotFoundException('问题不存在');
        }
        return response_1.ApiResponse.success(question);
    }
    async updateQuestion(id, data) {
        const question = await this.questionsService.updateQuestion(+id, data);
        if (!question) {
            throw new common_1.NotFoundException('问题不存在');
        }
        return response_1.ApiResponse.success(question, '更新成功');
    }
    async deleteQuestion(id) {
        const success = await this.questionsService.deleteQuestion(+id);
        if (!success) {
            throw new common_1.NotFoundException('问题不存在');
        }
        return response_1.ApiResponse.success(null, '删除成功');
    }
    async createOption(data) {
        const option = await this.questionsService.createOption(data);
        return response_1.ApiResponse.success(option, '创建成功');
    }
    async findOptions(id) {
        const options = await this.questionsService.findOptionsByQuestionId(+id);
        return response_1.ApiResponse.success(options);
    }
    async updateOption(optionId, data) {
        const option = await this.questionsService.updateOption(+optionId, data);
        if (!option) {
            throw new common_1.NotFoundException('选项不存在');
        }
        return response_1.ApiResponse.success(option, '更新成功');
    }
    async deleteOption(optionId) {
        const success = await this.questionsService.deleteOption(+optionId);
        if (!success) {
            throw new common_1.NotFoundException('选项不存在');
        }
        return response_1.ApiResponse.success(null, '删除成功');
    }
};
exports.QuestionsController = QuestionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '创建问题' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "createQuestion", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '获取所有问题' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "findAllQuestions", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '获取问题详情' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: '问题ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "findQuestionById", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '更新问题' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: '问题ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "updateQuestion", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '删除问题' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: '问题ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "deleteQuestion", null);
__decorate([
    (0, common_1.Post)('options'),
    (0, swagger_1.ApiOperation)({ summary: '创建选项' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "createOption", null);
__decorate([
    (0, common_1.Get)(':id/options'),
    (0, swagger_1.ApiOperation)({ summary: '获取问题的所有选项' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: '问题ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "findOptions", null);
__decorate([
    (0, common_1.Put)('options/:optionId'),
    (0, swagger_1.ApiOperation)({ summary: '更新选项' }),
    (0, swagger_1.ApiParam)({ name: 'optionId', description: '选项ID' }),
    __param(0, (0, common_1.Param)('optionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "updateOption", null);
__decorate([
    (0, common_1.Delete)('options/:optionId'),
    (0, swagger_1.ApiOperation)({ summary: '删除选项' }),
    (0, swagger_1.ApiParam)({ name: 'optionId', description: '选项ID' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('optionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionsController.prototype, "deleteOption", null);
exports.QuestionsController = QuestionsController = __decorate([
    (0, swagger_1.ApiTags)('questions'),
    (0, common_1.Controller)('questions'),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService])
], QuestionsController);
//# sourceMappingURL=questions.controller.js.map