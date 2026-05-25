import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

const mockUserModel = {
  findById: jest.fn().mockReturnThis(),
  findOne: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  countDocuments: jest.fn(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn(),
  limit: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();
    service = module.get(UsersService);
    jest.clearAllMocks();
  });

  describe('findByUsername', () => {
    it('should throw NotFoundException when user does not exist', async () => {
      mockUserModel.exec.mockResolvedValue(null);
      await expect(service.findByUsername('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should return the user when found', async () => {
      const user = { _id: 'u1', username: 'alice', displayName: 'Alice' };
      mockUserModel.exec.mockResolvedValue(user);
      const result = await service.findByUsername('alice');
      expect(result).toEqual(user);
    });
  });

  describe('updateProfile', () => {
    it('should update and return the user', async () => {
      const updated = { _id: 'u1', displayName: 'Alice Updated' };
      mockUserModel.exec.mockResolvedValue(updated);
      const result = await service.updateProfile('u1', { displayName: 'Alice Updated' });
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if user not found after update', async () => {
      mockUserModel.exec.mockResolvedValue(null);
      await expect(service.updateProfile('bad-id', {})).rejects.toThrow(NotFoundException);
    });
  });
});
