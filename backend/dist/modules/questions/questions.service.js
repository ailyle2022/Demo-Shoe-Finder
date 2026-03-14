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
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const question_entity_1 = require("./question.entity");
const question_option_entity_1 = require("./question-option.entity");
let QuestionsService = class QuestionsService {
    constructor(questionRepository, optionRepository) {
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
    }
    async onModuleInit() {
        await this.seedData();
    }
    async seedData() {
        const count = await this.questionRepository.count();
        if (count > 0)
            return;
        const q0 = await this.questionRepository.save({
            question: '您的性别是？',
            category: '性别匹配',
            description: '用于筛选适合的鞋款',
        });
        const options0 = [
            { questionId: q0.id, answer: '男', dimension: '性别匹配', field: 'gender', value: '男', score: 100 },
            { questionId: q0.id, answer: '男', dimension: '性别匹配', field: 'gender', value: '中性', score: 100 },
            { questionId: q0.id, answer: '女', dimension: '性别匹配', field: 'gender', value: '女', score: 100 },
            { questionId: q0.id, answer: '女', dimension: '性别匹配', field: 'gender', value: '中性', score: 100 },
        ];
        const q1shoe = await this.questionRepository.save({
            question: '您需要的鞋款类型是？',
            category: '鞋款类型匹配',
            description: '用于筛选鞋款类型',
        });
        const options1shoe = [
            { questionId: q1shoe.id, answer: '路跑鞋', dimension: '鞋款类型匹配', field: 'shoeType', value: '路跑鞋', score: 100 },
            { questionId: q1shoe.id, answer: '越野跑鞋', dimension: '鞋款类型匹配', field: 'shoeType', value: '越野跑鞋', score: 100 },
            { questionId: q1shoe.id, answer: '训练鞋', dimension: '鞋款类型匹配', field: 'shoeType', value: '训练鞋', score: 100 },
            { questionId: q1shoe.id, answer: '竞速鞋', dimension: '鞋款类型匹配', field: 'shoeType', value: '竞速鞋', score: 100 },
        ];
        const q2scenario = await this.questionRepository.save({
            question: '您的主要跑步场景是？',
            category: '适用场景匹配',
            description: '用于筛选适用场景',
        });
        const options2scenario = [
            { questionId: q2scenario.id, answer: '日常路跑', dimension: '适用场景匹配', field: 'scenario', value: '城市路跑', score: 100 },
            { questionId: q2scenario.id, answer: '城市路跑', dimension: '适用场景匹配', field: 'scenario', value: '城市路跑', score: 100 },
            { questionId: q2scenario.id, answer: '训练', dimension: '适用场景匹配', field: 'scenario', value: '训练', score: 100 },
            { questionId: q2scenario.id, answer: '比赛', dimension: '适用场景匹配', field: 'scenario', value: '比赛', score: 100 },
        ];
        const q1 = await this.questionRepository.save({
            question: '你的跑步经验是？',
            category: '阶段匹配',
            description: '根据您的跑步经验推荐合适的鞋款',
        });
        const options1 = [
            { questionId: q1.id, answer: '初阶跑者', dimension: '阶段匹配', field: 'runningStage', value: '入门', score: 100 },
            { questionId: q1.id, answer: '初阶跑者', dimension: '阶段匹配', field: 'runningStage', value: '进阶', score: 40 },
            { questionId: q1.id, answer: '初阶跑者', dimension: '阶段匹配', field: 'runningStage', value: '备赛', score: -40 },
            { questionId: q1.id, answer: '进阶跑者', dimension: '阶段匹配', field: 'runningStage', value: '入门', score: 30 },
            { questionId: q1.id, answer: '进阶跑者', dimension: '阶段匹配', field: 'runningStage', value: '进阶', score: 100 },
            { questionId: q1.id, answer: '进阶跑者', dimension: '阶段匹配', field: 'runningStage', value: '备赛', score: 60 },
            { questionId: q1.id, answer: '资深跑者', dimension: '阶段匹配', field: 'runningStage', value: '入门', score: -50 },
            { questionId: q1.id, answer: '资深跑者', dimension: '阶段匹配', field: 'runningStage', value: '进阶', score: 50 },
            { questionId: q1.id, answer: '资深跑者', dimension: '阶段匹配', field: 'runningStage', value: '备赛', score: 100 },
        ];
        const q2 = await this.questionRepository.save({
            question: '你当前跑步的主要目的？',
            category: '鞋款定位匹配',
            description: '根据您的跑步目标推荐合适的鞋款定位',
        });
        const options2 = [
            { questionId: q2.id, answer: '日常慢跑', dimension: '鞋款定位匹配', field: 'positioning', value: '日常训练', score: 100 },
            { questionId: q2.id, answer: '日常慢跑', dimension: '鞋款定位匹配', field: 'positioning', value: '缓震取向', score: 80 },
            { questionId: q2.id, answer: '日常慢跑', dimension: '鞋款定位匹配', field: 'positioning', value: '性能取向', score: 30 },
            { questionId: q2.id, answer: '提升训练', dimension: '鞋款定位匹配', field: 'positioning', value: '日常训练', score: 60 },
            { questionId: q2.id, answer: '提升训练', dimension: '鞋款定位匹配', field: 'positioning', value: '缓震取向', score: 100 },
            { questionId: q2.id, answer: '提升训练', dimension: '鞋款定位匹配', field: 'positioning', value: '性能取向', score: 80 },
            { questionId: q2.id, answer: '专业备赛', dimension: '鞋款定位匹配', field: 'positioning', value: '日常训练', score: 100 },
            { questionId: q2.id, answer: '专业备赛', dimension: '鞋款定位匹配', field: 'positioning', value: '缓震取向', score: 50 },
            { questionId: q2.id, answer: '专业备赛', dimension: '鞋款定位匹配', field: 'positioning', value: '性能取向', score: 20 },
        ];
        const q3 = await this.questionRepository.save({
            question: '你的体重区间是？',
            category: '体验修正',
            description: '根据体重选择合适的缓震和稳定感',
        });
        const options3 = [
            { questionId: q3.id, answer: '偏重', dimension: '体验修正', field: 'cushioning', value: '高', score: 120 },
            { questionId: q3.id, answer: '偏重', dimension: '体验修正', field: 'cushioning', value: '中', score: 80 },
            { questionId: q3.id, answer: '偏重', dimension: '体验修正', field: 'cushioning', value: '低', score: 30 },
            { questionId: q3.id, answer: '偏重', dimension: '体验修正', field: 'stability', value: '高', score: 120 },
            { questionId: q3.id, answer: '偏重', dimension: '体验修正', field: 'stability', value: '中', score: 80 },
            { questionId: q3.id, answer: '偏重', dimension: '体验修正', field: 'stability', value: '低', score: 30 },
            { questionId: q3.id, answer: '偏重', dimension: '体验修正', field: 'sensitivity', value: '高', score: 20 },
            { questionId: q3.id, answer: '偏重', dimension: '体验修正', field: 'sensitivity', value: '中', score: 50 },
            { questionId: q3.id, answer: '偏重', dimension: '体验修正', field: 'sensitivity', value: '低', score: 80 },
            { questionId: q3.id, answer: '标准', dimension: '体验修正', field: 'cushioning', value: '高', score: 120 },
            { questionId: q3.id, answer: '标准', dimension: '体验修正', field: 'cushioning', value: '中', score: 80 },
            { questionId: q3.id, answer: '标准', dimension: '体验修正', field: 'cushioning', value: '低', score: 30 },
            { questionId: q3.id, answer: '标准', dimension: '体验修正', field: 'stability', value: '高', score: 120 },
            { questionId: q3.id, answer: '标准', dimension: '体验修正', field: 'stability', value: '中', score: 80 },
            { questionId: q3.id, answer: '标准', dimension: '体验修正', field: 'stability', value: '低', score: 30 },
            { questionId: q3.id, answer: '标准', dimension: '体验修正', field: 'sensitivity', value: '高', score: 20 },
            { questionId: q3.id, answer: '标准', dimension: '体验修正', field: 'sensitivity', value: '中', score: 50 },
            { questionId: q3.id, answer: '标准', dimension: '体验修正', field: 'sensitivity', value: '低', score: 80 },
            { questionId: q3.id, answer: '偏轻', dimension: '体验修正', field: 'cushioning', value: '高', score: 80 },
            { questionId: q3.id, answer: '偏轻', dimension: '体验修正', field: 'cushioning', value: '中', score: 80 },
            { questionId: q3.id, answer: '偏轻', dimension: '体验修正', field: 'cushioning', value: '低', score: 30 },
            { questionId: q3.id, answer: '偏轻', dimension: '体验修正', field: 'stability', value: '高', score: 80 },
            { questionId: q3.id, answer: '偏轻', dimension: '体验修正', field: 'stability', value: '中', score: 80 },
            { questionId: q3.id, answer: '偏轻', dimension: '体验修正', field: 'stability', value: '低', score: 30 },
            { questionId: q3.id, answer: '偏轻', dimension: '体验修正', field: 'sensitivity', value: '高', score: 120 },
            { questionId: q3.id, answer: '偏轻', dimension: '体验修正', field: 'sensitivity', value: '中', score: 80 },
            { questionId: q3.id, answer: '偏轻', dimension: '体验修正', field: 'sensitivity', value: '低', score: 20 },
        ];
        for (const opt of [...options0, ...options1shoe, ...options2scenario, ...options1, ...options2, ...options3]) {
            await this.optionRepository.save(opt);
        }
        console.log('Questions seeded successfully');
    }
    async createQuestion(data) {
        const question = this.questionRepository.create(data);
        return this.questionRepository.save(question);
    }
    async findAllQuestions() {
        return this.questionRepository.find();
    }
    async findQuestionById(id) {
        return this.questionRepository.findOne({ where: { id } });
    }
    async updateQuestion(id, data) {
        await this.questionRepository.update(id, data);
        return this.findQuestionById(id);
    }
    async deleteQuestion(id) {
        await this.optionRepository.delete({ questionId: id });
        const result = await this.questionRepository.delete(id);
        return (result.affected || 0) > 0;
    }
    async createOption(data) {
        const option = this.optionRepository.create(data);
        return this.optionRepository.save(option);
    }
    async findOptionsByQuestionId(questionId) {
        return this.optionRepository.find({ where: { questionId } });
    }
    async updateOption(id, data) {
        await this.optionRepository.update(id, data);
        return this.optionRepository.findOne({ where: { id } });
    }
    async deleteOption(id) {
        const result = await this.optionRepository.delete(id);
        return (result.affected || 0) > 0;
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_entity_1.Question)),
    __param(1, (0, typeorm_1.InjectRepository)(question_option_entity_1.QuestionOption)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map