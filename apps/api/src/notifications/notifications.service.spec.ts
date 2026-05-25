import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { Notification } from './schemas/notification.schema';

const mockNotifModel = {
  create: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  updateMany: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  deleteMany: jest.fn(),
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getModelToken(Notification.name), useValue: mockNotifModel },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a notification with correct fields', async () => {
      const mockNotif = { _id: 'n1', type: 'like', recipient: 'user1' };
      mockNotifModel.create.mockResolvedValue(mockNotif);

      const result = await service.create({
        recipientId: 'user1',
        actorId: 'user2',
        type: 'like',
        castId: 'cast1',
      });

      expect(mockNotifModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'like' }),
      );
      expect(result).toEqual(mockNotif);
    });
  });

  describe('markAllRead', () => {
    it('should update all unread notifications for user', async () => {
      mockNotifModel.updateMany.mockReturnValue({ exec: jest.fn().mockResolvedValue({ modifiedCount: 3 }) });

      await service.markAllRead('user1');

      expect(mockNotifModel.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ read: false }),
        { read: true },
      );
    });
  });

  describe('getUnreadCount', () => {
    it('should return count of unread notifications', async () => {
      mockNotifModel.countDocuments.mockResolvedValue(5);

      const count = await service.getUnreadCount('user1');
      expect(count).toBe(5);
    });
  });
});
