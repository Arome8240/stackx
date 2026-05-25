import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import { TipsService } from './tips.service';
import { Tip } from './schemas/tip.schema';

const mockTipModel = {
  create: jest.fn(),
  find: jest.fn().mockReturnThis(),
  aggregate: jest.fn(),
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

describe('TipsService', () => {
  let service: TipsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TipsService,
        { provide: getModelToken(Tip.name), useValue: mockTipModel },
      ],
    }).compile();
    service = module.get(TipsService);
    jest.clearAllMocks();
  });

  describe('recordTip', () => {
    it('should calculate 2.5% platform fee', async () => {
      const tip = { amountMicroStx: 1_000_000, platformFeeMicroStx: 25_000, netAmountMicroStx: 975_000 };
      mockTipModel.create.mockResolvedValue(tip);

      await service.recordTip({
        sender: 'sender-id',
        recipient: 'recipient-id',
        cast: 'cast-id',
        amountMicroStx: 1_000_000,
        txId: 'tx123',
        blockHeight: 100,
      });

      expect(mockTipModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amountMicroStx: 1_000_000,
          platformFeeMicroStx: 25_000,
          netAmountMicroStx: 975_000,
        }),
      );
    });

    it('should default status to confirmed', async () => {
      mockTipModel.create.mockResolvedValue({});
      await service.recordTip({
        sender: 's', recipient: 'r', cast: 'c',
        amountMicroStx: 100, txId: 'tx', blockHeight: 1,
      });
      expect(mockTipModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'confirmed' }),
      );
    });
  });
});
