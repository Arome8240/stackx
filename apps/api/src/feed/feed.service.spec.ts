import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { FeedService } from './feed.service';
import { Follow } from './schemas/follow.schema';
import { Cast } from '../casts/schemas/cast.schema';
import { UsersService } from '../users/users.service';

const mockFollowModel = {
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  exists: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
};

const mockCastModel = {
  find: jest.fn(),
  countDocuments: jest.fn(),
};

const mockUsersService = {
  incrementFollowing: jest.fn(),
  incrementFollowers: jest.fn(),
};

describe('FeedService', () => {
  let service: FeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        { provide: getModelToken(Follow.name), useValue: mockFollowModel },
        { provide: getModelToken(Cast.name), useValue: mockCastModel },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
    jest.clearAllMocks();
  });

  describe('follow', () => {
    it('should upsert follow record and increment counts', async () => {
      mockFollowModel.findOneAndUpdate.mockReturnValue({ exec: jest.fn().mockResolvedValue({}) });
      mockUsersService.incrementFollowing.mockResolvedValue(undefined);
      mockUsersService.incrementFollowers.mockResolvedValue(undefined);

      await service.follow('user1', 'user2');

      expect(mockFollowModel.findOneAndUpdate).toHaveBeenCalledWith(
        expect.objectContaining({}),
        {},
        expect.objectContaining({ upsert: true }),
      );
      expect(mockUsersService.incrementFollowing).toHaveBeenCalledWith('user1', 1);
      expect(mockUsersService.incrementFollowers).toHaveBeenCalledWith('user2', 1);
    });
  });

  describe('isFollowing', () => {
    it('should return true when follow record exists', async () => {
      mockFollowModel.exists.mockResolvedValue({ _id: 'follow1' });

      const result = await service.isFollowing('user1', 'user2');
      expect(result).toBe(true);
    });

    it('should return false when follow record does not exist', async () => {
      mockFollowModel.exists.mockResolvedValue(null);

      const result = await service.isFollowing('user1', 'user2');
      expect(result).toBe(false);
    });
  });
});
