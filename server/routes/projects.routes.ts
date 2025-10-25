import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all projects (filtered by user permissions) with pagination
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const { status, type, page = '1', limit = '20', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    // Build filter based on role
    const where: any = {};
    
    // Filter by status if provided
    if (status) where.status = status as string;
    if (type) where.type = type as string;

    // Role-based filtering (optimized with indexes)
    if (currentUser.role === 'requester') {
      where.createdById = currentUser.id;
    } else if (currentUser.role === 'designer_internal' || currentUser.role === 'designer_external') {
      where.OR = [
        { assigneeId: currentUser.id },
        { createdById: currentUser.id },
      ];
    } else if (currentUser.role === 'reviewer') {
      where.OR = [
        { reviewerId: currentUser.id },
        { status: 'ready_for_review' },
      ];
    }
    // Admin and approver can see all projects

    // Determine sort field and order
    const orderBy: any = {};
    orderBy[sortBy as string] = sortOrder as 'asc' | 'desc';

    // Execute count and fetch in parallel
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          createdBy: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          institution: {
            select: { id: true, name: true, type: true },
          },
          assignee: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          reviewer: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          approver: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          _count: {
            select: { 
              proofs: true,
              reviews: true,
              activities: true,
            },
          },
          proofs: {
            orderBy: { version: 'desc' },
            take: 1,
            select: {
              id: true,
              version: true,
              fileUrl: true,
              fileName: true,
              uploadedAt: true,
            },
          },
        },
        orderBy,
        take: limitNum,
        skip,
      }),
      prisma.project.count({ where }),
    ]);

    res.json({ 
      projects,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
  }
});

// Get project by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
        institution: true,
        assignee: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
        reviewer: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
        approver: {
          select: { id: true, name: true, email: true, avatar: true, role: true },
        },
        assets: true,
        proofs: {
          orderBy: { version: 'desc' },
          include: {
            uploadedBy: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: {
            reviewer: {
              select: { id: true, name: true, email: true, avatar: true },
            },
            proof: true,
          },
        },
        approvals: {
          orderBy: { createdAt: 'desc' },
          include: {
            approver: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check permissions
    const canView =
      currentUser.role === 'admin' ||
      currentUser.role === 'approver' ||
      project.createdById === currentUser.id ||
      project.assigneeId === currentUser.id ||
      project.reviewerId === currentUser.id ||
      project.approverId === currentUser.id;

    if (!canView) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ project });
  } catch (error: any) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project', details: error.message });
  }
});

// Create project
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const {
      title,
      description,
      brief,
      type,
      size,
      quantity,
      deadline,
      institutionId,
    } = req.body;

    // Validate required fields
    if (!title || !type || !size || !quantity || !deadline || !institutionId) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, type, size, quantity, deadline, institutionId' 
      });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        brief,
        type,
        size,
        quantity: parseInt(quantity),
        deadline: new Date(deadline),
        status: 'draft',
        createdById: currentUser.id,
        institutionId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        institution: true,
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'project_created',
        description: `Created project "${title}"`,
        userId: currentUser.id,
        projectId: project.id,
      },
    });

    res.status(201).json({ project });
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
});

// Update project
router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;

    // Check if project exists and user has permission
    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const canEdit =
      currentUser.role === 'admin' ||
      existingProject.createdById === currentUser.id ||
      existingProject.assigneeId === currentUser.id;

    if (!canEdit) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const {
      title,
      description,
      brief,
      type,
      size,
      quantity,
      deadline,
      status,
      assigneeId,
      reviewerId,
      approverId,
    } = req.body;

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (brief !== undefined) updateData.brief = brief;
    if (type !== undefined) updateData.type = type;
    if (size !== undefined) updateData.size = size;
    if (quantity !== undefined) updateData.quantity = parseInt(quantity);
    if (deadline !== undefined) updateData.deadline = new Date(deadline);
    if (status !== undefined) updateData.status = status;

    // Only admin and approver can assign users
    if (currentUser.role === 'admin' || currentUser.role === 'approver') {
      if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
      if (reviewerId !== undefined) updateData.reviewerId = reviewerId;
      if (approverId !== undefined) updateData.approverId = approverId;
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        institution: true,
        assignee: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        reviewer: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        approver: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'project_updated',
        description: `Updated project "${project.title}"`,
        userId: currentUser.id,
        projectId: id,
      },
    });

    res.json({ project });
  } catch (error: any) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project', details: error.message });
  }
});

// Delete project
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only creator or admin can delete
    if (project.createdById !== currentUser.id && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.project.delete({ where: { id } });

    res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project', details: error.message });
  }
});

// Get project statistics
router.get('/stats/dashboard', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;

    // Build filter based on role
    const where: any = {};
    if (currentUser.role === 'requester') {
      where.createdById = currentUser.id;
    } else if (currentUser.role === 'designer_internal' || currentUser.role === 'designer_external') {
      where.assigneeId = currentUser.id;
    } else if (currentUser.role === 'reviewer') {
      where.reviewerId = currentUser.id;
    }

    const [totalProjects, projectsByStatus, upcomingDeadlines] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      prisma.project.findMany({
        where: {
          ...where,
          deadline: {
            gte: new Date(),
          },
        },
        include: {
          createdBy: { select: { name: true } },
          institution: { select: { name: true } },
        },
        orderBy: { deadline: 'asc' },
        take: 5,
      }),
    ]);

    const statusCounts = projectsByStatus.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      stats: {
        totalProjects,
        projectsByStatus: statusCounts,
        upcomingDeadlines,
      },
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }
});

export default router;
