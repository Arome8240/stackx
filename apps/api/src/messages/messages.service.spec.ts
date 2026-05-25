import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MessagesService } from './messages.service';
import { Message } from './schemas/message.schema';

const mockMessageModel = {
  create: jest.fn(),
  find: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  updateMany: jest.fn(),
  countDocuments: jest.fn(),
  aggregate: jest.fn(),
  populate: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: getModelToken(Message.name), useValue: mockMessageModel },
      ],
    }).compile();
    service = module.get(MessagesService);
    jest.clearAllMocks();
  });

  describe('send', () => {
    it('should create a message with sender and recipient', async () => {
      mockMessageModel.exec.mockResolvedValue({ _id: 'msg1', body: 'Hello', sender: 'user1', recipient: 'user2' });
      mockMessageModel.create.mockResolvedValue({ _id: 'msg1', body: 'Hello' });

      await service.send({ senderId: 'user1', recipientId: 'user2', body: 'Hello' });

      expect(mockMessageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ sender: 'user1', recipient: 'user2', body: 'Hello' }),
      );
    });
  });

  describe('markRead', () => {
    it('should mark all unread messages from sender as read', async () => {
      mockMessageModel.updateMany.mockResolvedValue({ modifiedCount: 3 });
      await service.markRead('user1', 'user2');
      expect(mockMessageModel.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ sender: 'user2', recipient: 'user1', read: false }),
        { $set: { read: true } },
      );
    });
  });
});
