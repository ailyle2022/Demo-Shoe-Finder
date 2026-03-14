import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './user.entity.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(query: UserQueryDto): Promise<{
        list: User[];
        total: number;
    }>;
    findById(id: number): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    validatePassword(username: string, password: string): Promise<boolean>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User | null>;
    remove(id: number): Promise<boolean>;
}
