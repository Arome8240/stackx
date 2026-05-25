import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { GovernanceService } from './governance.service';
import { Proposal } from './schemas/proposal.schema';
import { GovernanceVote } from './schemas/governance-vote.schema';

const mockProposalModel = {
  create: jest.fn(),
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

const mockVoteModel = {
  create: jest.fn(),
  findOne: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

describe('GovernanceService', () => {
  let service: GovernanceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GovernanceService,
        { provide: getModelToken(Proposal.name), useValue: mockProposalModel },
        { provide: getModelToken(GovernanceVote.name), useValue: mockVoteModel },
      ],
    }).compile();
    service = module.get(GovernanceService);
    jest.clearAllMocks();
  });

  describe('vote', () => {
    it('should throw NotFoundException if proposal not found', async () => {
      mockProposalModel.exec.mockResolvedValue(null);
      await expect(service.vote('proposal-id', 'user-id', 'yes', 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if proposal is not active', async () => {
      mockProposalModel.exec.mockResolvedValue({ _id: 'p1', status: 'passed', yesVotes: 0, noVotes: 0, quorum: 10 });
      await expect(service.vote('p1', 'user-id', 'yes', 1)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if user already voted', async () => {
      mockProposalModel.exec.mockResolvedValue({ _id: 'p1', status: 'active', yesVotes: 0, noVotes: 0, quorum: 10, endsAt: new Date(Date.now() + 86400000) });
      mockVoteModel.exec.mockResolvedValue({ vote: 'yes' });
      await expect(service.vote('p1', 'user-id', 'yes', 1)).rejects.toThrow(ConflictException);
    });
  });
});
