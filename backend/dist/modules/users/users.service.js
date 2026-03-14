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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { username: createUserDto.username },
        });
        if (existingUser) {
            throw new common_1.ConflictException('用户名已存在');
        }
        const existingEmail = await this.usersRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('邮箱已被使用');
        }
        const newUser = this.usersRepository.create({
            username: createUserDto.username,
            password: createUserDto.password,
            email: createUserDto.email,
            nickname: createUserDto.nickname || createUserDto.username,
        });
        return this.usersRepository.save(newUser);
    }
    async findAll(query) {
        const queryBuilder = this.usersRepository.createQueryBuilder('user');
        if (query.keyword) {
            queryBuilder.where('user.username LIKE :keyword OR user.email LIKE :keyword OR user.nickname LIKE :keyword', { keyword: `%${query.keyword}%` });
        }
        const total = await queryBuilder.getCount();
        const page = query.page || 1;
        const pageSize = query.pageSize || 10;
        const list = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getMany();
        return { list, total };
    }
    async findById(id) {
        return this.usersRepository.findOne({ where: { id } });
    }
    async findByUsername(username) {
        return this.usersRepository.findOne({ where: { username } });
    }
    async validatePassword(username, password) {
        const user = await this.findByUsername(username);
        if (!user)
            return false;
        return user.password === password;
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        if (!user)
            return null;
        if (updateUserDto.password) {
            user.password = updateUserDto.password;
        }
        if (updateUserDto.email) {
            user.email = updateUserDto.email;
        }
        if (updateUserDto.nickname) {
            user.nickname = updateUserDto.nickname;
        }
        return this.usersRepository.save(user);
    }
    async remove(id) {
        const result = await this.usersRepository.delete(id);
        return (result.affected || 0) > 0;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map