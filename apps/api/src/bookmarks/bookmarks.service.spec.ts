import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { Bookmark } from './schemas/bookmark.schema';

const mockModel = {
  create: jest.fn(),
  findOne: jest.fn().mockReturnThis(),
  findOneAndDelete: jest.fn(),
  deleteMany: jest.fn(),
  find: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

describe('BookmarksService', () => {
  let service: BookmarksService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BookmarksService,
        { provide: getModelToken(Bookmark.name), useValue: mockModel },
      ],
    }).compile();
    service = module.get(BookmarksService);
    jest.clearAllMocks();
  });

  describe('add', () => {
    it('should throw ConflictException if already bookmarked', async () => {
      mockModel.exec.mockResolvedValue({ _id: 'bm1' });
      await expect(service.add('user-id', 'cast-id')).rejects.toThrow(ConflictException);
    });

    it('should create bookmark if not already saved', async () => {
      mockModel.exec.mockResolvedValue(null);
      mockModel.create.mockResolvedValue({ _id: 'bm1', user: 'user-id', cast: 'cast-id' });
      const result = await service.add('user-id', 'cast-id');
      expect(mockModel.create).toHaveBeenCalledWith({ user: 'user-id', cast: 'cast-id' });
    });
  });

  describe('isBookmarked', () => {
    it('should return true when bookmark exists', async () => {
      mockModel.exec.mockResolvedValue({ _id: 'bm1' });
      const result = await service.isBookmarked('user-id', 'cast-id');
      expect(result).toBe(true);
    });

    it('should return false when bookmark does not exist', async () => {
      mockModel.exec.mockResolvedValue(null);
      const result = await service.isBookmarked('user-id', 'cast-id');
      expect(result).toBe(false);
    });
  });
});
