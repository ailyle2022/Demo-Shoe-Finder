import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { QuestionOption } from './question-option.entity';
export declare class QuestionsService implements OnModuleInit {
    private questionRepository;
    private optionRepository;
    constructor(questionRepository: Repository<Question>, optionRepository: Repository<QuestionOption>);
    onModuleInit(): Promise<void>;
    private seedData;
    createQuestion(data: Partial<Question>): Promise<Question>;
    findAllQuestions(): Promise<Question[]>;
    findQuestionById(id: number): Promise<Question | null>;
    updateQuestion(id: number, data: Partial<Question>): Promise<Question | null>;
    deleteQuestion(id: number): Promise<boolean>;
    createOption(data: Partial<QuestionOption>): Promise<QuestionOption>;
    findOptionsByQuestionId(questionId: number): Promise<QuestionOption[]>;
    updateOption(id: number, data: Partial<QuestionOption>): Promise<QuestionOption | null>;
    deleteOption(id: number): Promise<boolean>;
}
