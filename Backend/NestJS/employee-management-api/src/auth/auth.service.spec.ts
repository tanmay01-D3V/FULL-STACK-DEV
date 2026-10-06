import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findUserByUsername: async () => null,
            findUserByEmail: async () => null,
            create: async () => ({ id: 1, name: 'Test User', username: 'test', email: 'test@example.com', password: 'hashed' }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: async () => 'signed-token',
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
