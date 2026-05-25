import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { CastsService } from './casts.service';
import { Cast } from './schemas/cast.schema';
import { UsersService } from '../users/users.service';

const mockCastModel = {
  create: jest.fn(),
  findById: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  findOneAndDelete: jest.fn(),
};

const mockUsersService = {
  incrementCastsCount: jest.fn(),
};

describe('CastsService', () => {
  let service: CastsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CastsService,
        { provide: getModelToken(Cast.name), useValue: mockCastModel },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<CastsService>(CastsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a cast and increment user casts count', async () => {
      const dto = { content: 'Hello Stacks!', images: [] };
      const authorId = 'user123';
      const mockCast = { _id: 'cast1', content: dto.content, author: authorId };

      mockCastModel.create.mockResolvedValue(mockCast);
      mockUsersService.incrementCastsCount.mockResolvedValue(undefined);

      const result = await service.create(authorId, dto);

      expect(mockCastModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ content: dto.content }),
      );
      expect(mockUsersService.incrementCastsCount).toHaveBeenCalledWith(authorId, 1);
      expect(result).toEqual(mockCast);
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when cast does not exist', async () => {
      mockCastModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should return cast when it exists', async () => {
      const mockCast = { _id: 'cast1', content: 'Test', deleted: false };
      mockCastModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockCast) }),
      });

      const result = await service.findById('cast1');
      expect(result).toEqual(mockCast);
    });
  });

  describe('like', () => {
    it('should increment likes count', async () => {
      mockCastModel.findByIdAndUpdate.mockResolvedValue({});

      await service.like('cast1', 'user1');

      expect(mockCastModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'cast1',
        { $inc: { likesCount: 1 } },
      );
    });
  });
});
