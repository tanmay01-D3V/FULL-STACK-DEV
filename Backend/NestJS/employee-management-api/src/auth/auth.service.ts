import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, username, email, password } = registerDto;

    const existing = await this.usersService.findUserByUsername(username);
    if (existing) {
      throw new ConflictException('Username already exists');
    }

    const existingEmail = await this.usersService.findUserByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hash(password, 10);
    const user = await this.usersService.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      accessToken: await this.jwtService.signAsync({ sub: user.id, username: user.username }),
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      accessToken: await this.jwtService.signAsync({ sub: user.id, username: user.username }),
    };
  }
}
