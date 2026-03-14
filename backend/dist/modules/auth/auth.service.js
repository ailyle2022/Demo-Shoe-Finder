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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async login(loginDto) {
        const { username, password } = loginDto;
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        const isPasswordValid = await this.usersService.validatePassword(username, password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        const token = this.generateToken(username);
        return {
            userId: user.id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            token,
        };
    }
    async register(registerDto) {
        const { username, password, email, nickname } = registerDto;
        const newUser = await this.usersService.create({
            username,
            password,
            email,
            nickname,
        });
        const token = this.generateToken(username);
        return {
            userId: newUser.id,
            username: newUser.username,
            email: newUser.email,
            nickname: newUser.nickname,
            token,
        };
    }
    generateToken(username) {
        const payload = {
            username,
            timestamp: Date.now(),
        };
        return Buffer.from(JSON.stringify(payload)).toString('base64');
    }
    logout(token) {
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map