import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, LoginResponseDto } from './auth.dto';
import { ApiResponse as CustomResponse } from '../../common/response';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<CustomResponse<LoginResponseDto>>;
    register(registerDto: RegisterDto): Promise<CustomResponse<LoginResponseDto>>;
    logout(authHeader: string): CustomResponse<void>;
}
