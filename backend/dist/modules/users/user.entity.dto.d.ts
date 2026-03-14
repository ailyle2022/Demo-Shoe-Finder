export declare class CreateUserDto {
    username: string;
    password: string;
    email: string;
    nickname?: string;
}
export declare class UpdateUserDto {
    email?: string;
    nickname?: string;
    password?: string;
}
export declare class UserQueryDto {
    page?: number;
    pageSize?: number;
    keyword?: string;
}
