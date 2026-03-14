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
exports.QuestionsCalculationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const response_1 = require("../../common/response");
const questions_service_1 = require("./questions.service");
const products_service_1 = require("../products/products.service");
let QuestionsCalculationController = class QuestionsCalculationController {
    constructor(questionsService, productsService) {
        this.questionsService = questionsService;
        this.productsService = productsService;
    }
    async calculate(answers) {
        const userAnswers = answers;
        const questions = await this.questionsService.findAllQuestions();
        const optionsMap = {};
        for (const q of questions) {
            const options = await this.questionsService.findOptionsByQuestionId(q.id);
            optionsMap[q.id] = {};
            for (const opt of options) {
                if (!optionsMap[q.id][opt.answer]) {
                    optionsMap[q.id][opt.answer] = [];
                }
                optionsMap[q.id][opt.answer].push(opt);
            }
        }
        const allProducts = await this.productsService.findAll({ page: 1, pageSize: 100 });
        let products = allProducts.list;
        const results = [];
        for (const product of products) {
            let stageScore = 0;
            let positioningScore = 0;
            let experienceScore = 0;
            for (const q of questions) {
                const userAnswer = userAnswers[q.id];
                if (!userAnswer)
                    continue;
                const userOptions = optionsMap[q.id]?.[userAnswer] || [];
                if (q.category === '阶段匹配') {
                    let matched = false;
                    for (const opt of userOptions) {
                        if (opt.field === 'runningStage' && product.runningStage === opt.value) {
                            stageScore = opt.score;
                            matched = true;
                            break;
                        }
                    }
                    if (!matched)
                        stageScore = 50;
                }
                else if (q.category === '鞋款定位匹配') {
                    let matched = false;
                    for (const opt of userOptions) {
                        if (opt.field === 'positioning' && product.positioning === opt.value) {
                            positioningScore = opt.score;
                            matched = true;
                            break;
                        }
                    }
                    if (!matched)
                        positioningScore = 50;
                }
                else if (q.category === '体验修正') {
                    let matchCount = 0;
                    for (const opt of userOptions) {
                        if (opt.field === 'cushioning' && product.cushioning === opt.value) {
                            experienceScore += opt.score;
                            matchCount++;
                        }
                        else if (opt.field === 'stability' && product.stability === opt.value) {
                            experienceScore += opt.score;
                            matchCount++;
                        }
                        else if (opt.field === 'sensitivity' && product.sensitivity === opt.value) {
                            experienceScore += opt.score;
                            matchCount++;
                        }
                    }
                    if (matchCount > 0) {
                        experienceScore = experienceScore / matchCount;
                    }
                    else {
                        experienceScore = 50;
                    }
                }
            }
            const normalizedStage = stageScore;
            const normalizedPositioning = positioningScore;
            const normalizedExperience = experienceScore;
            const totalScore = normalizedStage * 0.4 + normalizedPositioning * 0.25 + normalizedExperience * 0.35;
            results.push({
                ...product,
                stageScore: normalizedStage,
                positioningScore: normalizedPositioning,
                experienceScore: normalizedExperience,
                totalScore: Math.round(totalScore),
            });
        }
        results.sort((a, b) => b.totalScore - a.totalScore);
        return response_1.ApiResponse.success(results);
    }
};
exports.QuestionsCalculationController = QuestionsCalculationController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: '问卷提交计算' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuestionsCalculationController.prototype, "calculate", null);
exports.QuestionsCalculationController = QuestionsCalculationController = __decorate([
    (0, swagger_1.ApiTags)('questions-calculation'),
    (0, common_1.Controller)('questions-calculation'),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService,
        products_service_1.ProductsService])
], QuestionsCalculationController);
//# sourceMappingURL=questions-calculation.controller.js.map