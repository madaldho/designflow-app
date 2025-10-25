import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get recent activities
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const { limit = 20, projectId } = req.query;

    // Build filter
    const where: any = {};
    
    // Filter by project if specified
    if (projectId) {
      where.projectId = projectId as string;
    }

    // Role-based filtering
    if (currentUser.role === 'requester') {
      // Only see own activities
      where.userId = currentUser.id;
    } else if (currentUser.role === 'designer_internal' || currentUser.role === 'designer_external') {
      // See activities for assigned projects or own activities
      where.OR = [
        { userId: currentUser.id },
        {
          project: {
            assigneeId: currentUser.id,
          },
        },
      ];
    } else if (currentUser.role === 'reviewer') {
      // See activities for projects under review
      where.OR = [
        { userId: currentUser.id },
        {
          project: {
            reviewerId: currentUser.id,
          },
        },
      ];
    }
    // Admin and approver can see all

    const activities = await prisma.activity.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        project: {
          select: { id: true, title: true, status: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit as string),
    });

    res.json({ activities });
  } catch (error: any) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to fetch activities', details: error.message });
  }
});

// Create activity log
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const { type, description, projectId, metadata } = req.body;

    if (!type || !description) {
      return res.status(400).json({ error: 'Type and description are required' });
    }

    const activity = await prisma.activity.create({
      data: {
        type,
        description,
        userId: currentUser.id,
        projectId,
        metadata,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        project: {
          select: { id: true, title: true },
        },
      },
    });

    res.status(201).json({ activity });
  } catch (error: any) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Failed to create activity', details: error.message });
  }
});

export default router;
