import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './user.entity.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // 创建用户
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 检查用户名是否已存在
    const existingUser = await this.usersRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('邮箱已被使用');
    }

    const newUser = this.usersRepository.create({
      username: createUserDto.username,
      password: createUserDto.password,
      email: createUserDto.email,
      nickname: createUserDto.nickname || createUserDto.username,
    });

    return this.usersRepository.save(newUser);
  }

  // 获取所有用户（支持分页和搜索）
  async findAll(query: UserQueryDto): Promise<{ list: User[]; total: number }> {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    // 搜索过滤
    if (query.keyword) {
      queryBuilder.where(
        'user.username LIKE :keyword OR user.email LIKE :keyword OR user.nickname LIKE :keyword',
        { keyword: `%${query.keyword}%` },
      );
    }

    const total = await queryBuilder.getCount();

    // 分页
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const list = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return { list, total };
  }

  // 根据ID获取用户
  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  // 根据用户名获取用户
  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  // 验证密码
  async validatePassword(username: string, password: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    if (!user) return false;
    return user.password === password;
  }

  // 更新用户
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    // 如果更新密码
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

  // 删除用户
  async remove(id: number): Promise<boolean> {
    const result = await this.usersRepository.delete(id);
    return (result.affected || 0) > 0;
  }
}
