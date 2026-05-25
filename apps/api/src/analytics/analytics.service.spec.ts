import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { Cast } from '../casts/schemas/cast.schema';
import { User } from '../users/schemas/user.schema';
import { Channel } from '../channels/schemas/channel.schema';
import { Tip } from '../tips/schemas/tip.schema';

const makeModel = () => ({
  find: jest.fn().mockReturnThis(),
  aggregate: jest.fn(),
  countDocuments: jest.fn(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn(),
});

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  const castModel = makeModel();
  const userModel = makeModel();
  const channelModel = makeModel();
  const tipModel = makeModel();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: getModelToken(Cast.name), useValue: castModel },
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: getModelToken(Channel.name), useValue: channelModel },
        { provide: getModelToken(Tip.name), useValue: tipModel },
      ],
    }).compile();
    service = module.get(AnalyticsService);
    jest.clearAllMocks();
  });

  describe('getPlatformStats', () => {
    it('should return zeroed stats if models return 0', async () => {
      castModel.countDocuments.mockResolvedValue(0);
      userModel.countDocuments.mockResolvedValue(0);
      channelModel.countDocuments.mockResolvedValue(0);
      tipModel.aggregate.mockResolvedValue([{ total: 0 }]);

      const stats = await service.getPlatformStats();
      expect(stats).toHaveProperty('totalCasts');
      expect(stats).toHaveProperty('totalUsers');
    });
  });
});
