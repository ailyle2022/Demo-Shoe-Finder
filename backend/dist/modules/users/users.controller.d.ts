import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './user.entity.dto';
import { ApiResponse as CustomResponse } from '../../common/response';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<CustomResponse<User>>;
    findAll(query: UserQueryDto): Promise<CustomResponse<{
        list: User[];
        total: number;
    }>>;
    findOne(id: string): Promise<CustomResponse<User>>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<CustomResponse<User>>;
    remove(id: string): Promise<CustomResponse<void>>;
}
