import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user notifications with pagination
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const { unreadOnly, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId: currentUser.id };

    if (unreadOnly === 'true') {
      where.read = false;
    }

    // Execute count and fetch in parallel for better performance
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limitNum,
        skip,
        // Select only necessary fields for better performance
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          data: true,
          read: true,
          readAt: true,
          createdAt: true,
        },
      }),
      prisma.notification.count({ where }),
    ]);

    res.json({ 
      notifications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications', details: error.message });
  }
});

// Get unread count
router.get('/unread-count', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;

    const count = await prisma.notification.count({
      where: {
        userId: currentUser.id,
        read: false,
      },
    });

    res.json({ count });
  } catch (error: any) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to fetch unread count', details: error.message });
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const { id } = req.params;

    // Verify ownership
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== currentUser.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    res.json({ notification: updatedNotification });
  } catch (error: any) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read', details: error.message });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;

    await prisma.notification.updateMany({
      where: {
        userId: currentUser.id,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to mark all as read', details: error.message });
  }
});

// Delete notification
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const { id } = req.params;

    // Verify ownership
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId !== currentUser.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.notification.delete({
      where: { id },
    });

    res.json({ message: 'Notification deleted' });
  } catch (error: any) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification', details: error.message });
  }
});

export default router;
