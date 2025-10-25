import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all print jobs (for designer_external/percetakan)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const { status } = req.query;

    // Build filter
    const where: any = {};
    if (status) where.status = status as string;

    const printJobs = await prisma.printJob.findMany({
      where,
      include: {
        project: {
          include: {
            institution: true,
            approver: {
              select: { id: true, name: true, email: true, avatar: true },
            },
            proofs: {
              where: { isFinal: true },
              orderBy: { version: 'desc' },
              take: 1,
            },
          },
        },
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ printJobs });
  } catch (error: any) {
    console.error('Get print jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch print jobs', details: error.message });
  }
});

// Get projects ready for print (status: approved_for_print)
router.get('/ready', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;

    // Only designer_external or admin can access
    if (currentUser.role !== 'designer_external' && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only percetakan can access this' });
    }

    const projects = await prisma.project.findMany({
      where: {
        status: 'approved_for_print',
      },
      include: {
        institution: true,
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        approver: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        proofs: {
          orderBy: { version: 'desc' },
          take: 1,
          include: {
            uploadedBy: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        approvals: {
          where: { status: 'approved' },
          orderBy: { approvedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { deadline: 'asc' },
    });

    res.json({ projects });
  } catch (error: any) {
    console.error('Get ready for print error:', error);
    res.status(500).json({ error: 'Failed to fetch ready projects', details: error.message });
  }
});

// Create print job (start printing)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const {
      projectId,
      notes,
      estimatedFinish,
    } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    // Only designer_external or admin can create print jobs
    if (currentUser.role !== 'designer_external' && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only percetakan can create print jobs' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.status !== 'approved_for_print') {
      return res.status(400).json({ error: 'Project must be approved for print first' });
    }

    const printJob = await prisma.printJob.create({
      data: {
        projectId,
        status: 'in_progress',
        startedAt: new Date(),
        estimatedFinish: estimatedFinish ? new Date(estimatedFinish) : null,
        notes,
        createdById: currentUser.id,
      },
      include: {
        project: true,
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Update project status to in_print
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'in_print' },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'print_started',
        description: `Started printing project "${project.title}"`,
        userId: currentUser.id,
        projectId,
      },
    });

    // Notify requester
    if (project.createdById) {
      await prisma.notification.create({
        data: {
          userId: project.createdById,
          type: 'print_started',
          title: 'Sedang Dicetak',
          message: `Proyek "${project.title}" sedang dalam proses cetak`,
          data: JSON.stringify({ projectId, printJobId: printJob.id }),
        },
      });
    }

    res.status(201).json({ printJob });
  } catch (error: any) {
    console.error('Create print job error:', error);
    res.status(500).json({ error: 'Failed to create print job', details: error.message });
  }
});

// Update print job status
router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;
    const {
      status,
      notes,
      completedAt,
    } = req.body;

    // Only designer_external or admin can update print jobs
    if (currentUser.role !== 'designer_external' && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only percetakan can update print jobs' });
    }

    const printJob = await prisma.printJob.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!printJob) {
      return res.status(404).json({ error: 'Print job not found' });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const updated = await prisma.printJob.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Update project status if print completed
    if (status === 'completed') {
      await prisma.project.update({
        where: { id: printJob.projectId },
        data: { status: 'ready' }, // Siap diambil
      });

      // Log activity
      await prisma.activity.create({
        data: {
          type: 'print_completed',
          description: `Completed printing project "${printJob.project.title}"`,
          userId: currentUser.id,
          projectId: printJob.projectId,
        },
      });

      // Notify requester
      if (printJob.project.createdById) {
        await prisma.notification.create({
          data: {
            userId: printJob.project.createdById,
            type: 'print_completed',
            title: 'Selesai Dicetak',
            message: `Proyek "${printJob.project.title}" selesai dicetak dan siap diambil`,
            data: JSON.stringify({ projectId: printJob.projectId, printJobId: id }),
          },
        });
      }
    }

    res.json({ printJob: updated });
  } catch (error: any) {
    console.error('Update print job error:', error);
    res.status(500).json({ error: 'Failed to update print job', details: error.message });
  }
});

// Get single print job
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const printJob = await prisma.printJob.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            institution: true,
            proofs: {
              orderBy: { version: 'desc' },
              take: 1,
            },
          },
        },
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    if (!printJob) {
      return res.status(404).json({ error: 'Print job not found' });
    }

    res.json({ printJob });
  } catch (error: any) {
    console.error('Get print job error:', error);
    res.status(500).json({ error: 'Failed to fetch print job', details: error.message });
  }
});

export default router;
