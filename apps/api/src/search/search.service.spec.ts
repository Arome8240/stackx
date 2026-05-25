import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SearchService } from './search.service';
import { Cast } from '../casts/schemas/cast.schema';
import { User } from '../users/schemas/user.schema';

const mockCastModel = {
  find: jest.fn(),
  aggregate: jest.fn(),
};

const mockUserModel = {
  find: jest.fn(),
};

const buildMockQuery = (result: unknown[]) => ({
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(result),
});

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: getModelToken(Cast.name), useValue: mockCastModel },
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
    jest.clearAllMocks();
  });

  describe('search', () => {
    it('should return empty results for empty query', async () => {
      const result = await service.search('');
      expect(result).toEqual({ users: [], casts: [], total: 0 });
    });

    it('should search both users and casts in parallel', async () => {
      const mockUsers = [{ username: 'alice', displayName: 'Alice' }];
      const mockCasts = [{ content: 'Hello world', deleted: false }];

      mockUserModel.find.mockReturnValue(buildMockQuery(mockUsers));
      mockCastModel.find.mockReturnValue(buildMockQuery(mockCasts));

      const result = await service.search('alice');

      expect(result.users).toEqual(mockUsers);
      expect(result.casts).toEqual(mockCasts);
      expect(result.total).toBe(2);
    });
  });

  describe('getTrendingTopics', () => {
    it('should return trending hashtags from aggregation', async () => {
      const mockTopics = [{ topic: '#stacks', count: 42 }];
      mockCastModel.aggregate.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockTopics) });

      const result = await service.getTrendingTopics(5);
      expect(result).toEqual(mockTopics);
    });
  });
});
