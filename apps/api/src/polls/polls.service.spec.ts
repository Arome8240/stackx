import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PollsService } from './polls.service';
import { Poll } from './schemas/poll.schema';
import { PollVote } from './schemas/poll-vote.schema';

const mockPollModel = {
  create: jest.fn(),
  findOne: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

const mockVoteModel = {
  create: jest.fn(),
  findOne: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

describe('PollsService', () => {
  let service: PollsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PollsService,
        { provide: getModelToken(Poll.name), useValue: mockPollModel },
        { provide: getModelToken(PollVote.name), useValue: mockVoteModel },
      ],
    }).compile();
    service = module.get(PollsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw BadRequestException with fewer than 2 options', async () => {
      await expect(
        service.create({ cast: 'cast-id', options: ['Only one'], creator: 'user-id' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException with more than 4 options', async () => {
      await expect(
        service.create({ cast: 'cast-id', options: ['a', 'b', 'c', 'd', 'e'], creator: 'user-id' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('vote', () => {
    it('should throw ConflictException on duplicate vote', async () => {
      mockPollModel.exec.mockResolvedValue({ options: [{ text: 'A' }, { text: 'B' }], closed: false });
      mockVoteModel.exec.mockResolvedValue({ optionIndex: 0 });
      await expect(service.vote('poll-id', 'user-id', 0)).rejects.toThrow(ConflictException);
    });
  });
});
