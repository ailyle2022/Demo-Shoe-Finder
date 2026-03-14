import { ApiResponse as CustomResponse } from '../../common/response';
import { QuestionsService } from './questions.service';
import { ProductsService } from '../products/products.service';
interface Answer {
    [questionId: string]: string;
}
interface ScoredProduct {
    id: number;
    productId: string;
    name: string;
    gender: string;
    shoeType: string;
    scenario: string;
    lastWidth: string;
    runningStage: string;
    positioning: string;
    cushioning: string;
    stability: string;
    sensitivity: string;
    weightHint: string;
    totalScore: number;
    stageScore: number;
    positioningScore: number;
    experienceScore: number;
}
export declare class QuestionsCalculationController {
    private readonly questionsService;
    private readonly productsService;
    constructor(questionsService: QuestionsService, productsService: ProductsService);
    calculate(answers: Answer): Promise<CustomResponse<ScoredProduct[]>>;
}
export {};
