export declare class LoginDto {
    username: string;
    password: string;
}
export declare class RegisterDto {
    username: string;
    password: string;
    email: string;
    nickname?: string;
}
export declare class LoginResponseDto {
    userId: number;
    username: string;
    email: string;
    nickname: string;
    token: string;
}
