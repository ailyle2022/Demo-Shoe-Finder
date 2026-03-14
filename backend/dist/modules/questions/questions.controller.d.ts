import { QuestionsService } from './questions.service';
import { Question } from './question.entity';
import { QuestionOption } from './question-option.entity';
import { ApiResponse as CustomResponse } from '../../common/response';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    createQuestion(data: Partial<Question>): Promise<CustomResponse<Question>>;
    findAllQuestions(): Promise<CustomResponse<Question[]>>;
    findQuestionById(id: string): Promise<CustomResponse<Question>>;
    updateQuestion(id: string, data: Partial<Question>): Promise<CustomResponse<Question>>;
    deleteQuestion(id: string): Promise<CustomResponse<void>>;
    createOption(data: Partial<QuestionOption>): Promise<CustomResponse<QuestionOption>>;
    findOptions(id: string): Promise<CustomResponse<QuestionOption[]>>;
    updateOption(optionId: string, data: Partial<QuestionOption>): Promise<CustomResponse<QuestionOption>>;
    deleteOption(optionId: string): Promise<CustomResponse<void>>;
}
