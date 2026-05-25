import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockUsersService = {
  create: jest.fn(),
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(() => 'mock.jwt.token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create a user and return accessToken', async () => {
      const mockUser = { _id: { toString: () => 'u1' }, email: 'a@b.com', username: 'alice', stxAddress: '' };
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await service.register({ username: 'alice', email: 'a@b.com', password: 'password1' });

      expect(result.accessToken).toBe('mock.jwt.token');
      expect(result.user.username).toBe('alice');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for unknown email', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login({ email: 'bad@bad.com', password: 'pass' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const mockUser = { _id: { toString: () => 'u1' }, email: 'a@b.com', username: 'alice', passwordHash: 'hashed', isSuspended: false };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({ email: 'a@b.com', password: 'wrong' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return accessToken for valid credentials', async () => {
      const mockUser = { _id: { toString: () => 'u1' }, email: 'a@b.com', username: 'alice', passwordHash: 'hashed', stxAddress: '', isSuspended: false };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({ email: 'a@b.com', password: 'correct' });

      expect(result.accessToken).toBe('mock.jwt.token');
      expect(result.user.email).toBe('a@b.com');
    });
  });
});
