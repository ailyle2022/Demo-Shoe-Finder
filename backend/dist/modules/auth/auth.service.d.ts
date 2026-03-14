import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, LoginResponseDto } from './auth.dto';
export declare class AuthService {
    private readonly usersService;
    constructor(usersService: UsersService);
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    register(registerDto: RegisterDto): Promise<LoginResponseDto>;
    private generateToken;
    logout(token: string): void;
}
