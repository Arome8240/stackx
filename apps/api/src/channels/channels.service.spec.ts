import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { Channel } from './schemas/channel.schema';
import { ChannelMember } from './schemas/channel-member.schema';

const mockChannelModel = {
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
};

const mockMemberModel = {
  create: jest.fn(),
  exists: jest.fn(),
  findOneAndDelete: jest.fn(),
  find: jest.fn(),
};

describe('ChannelsService', () => {
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        { provide: getModelToken(Channel.name), useValue: mockChannelModel },
        { provide: getModelToken(ChannelMember.name), useValue: mockMemberModel },
      ],
    }).compile();

    service = module.get<ChannelsService>(ChannelsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create channel and add creator as admin member', async () => {
      const dto = { name: 'test-channel', displayName: 'Test Channel' };
      const mockChannel = { _id: 'ch1', name: 'test-channel', creator: 'user1' };

      mockChannelModel.findOne.mockResolvedValue(null);
      mockChannelModel.create.mockResolvedValue(mockChannel);
      mockMemberModel.create.mockResolvedValue({});
      mockChannelModel.findByIdAndUpdate.mockResolvedValue({});

      const result = await service.create('user1', dto);

      expect(mockChannelModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'test-channel' }),
      );
      expect(mockMemberModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'admin' }),
      );
      expect(result).toEqual(mockChannel);
    });

    it('should throw ConflictException when channel name already exists', async () => {
      mockChannelModel.findOne.mockResolvedValue({ _id: 'existing', name: 'test-channel' });

      await expect(
        service.create('user1', { name: 'test-channel', displayName: 'Test' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findByName', () => {
    it('should throw NotFoundException for unknown channel', async () => {
      mockChannelModel.findOne.mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });

      await expect(service.findByName('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
