import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all pickup logs
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;

    // Build filter based on role
    const where: any = {};
    
    if (currentUser.role === 'requester') {
      // Only see own projects
      where.project = {
        createdById: currentUser.id,
      };
    }
    // Admin, approver, designer_external can see all

    const pickupLogs = await prisma.pickupLog.findMany({
      where,
      include: {
        project: {
          include: {
            institution: true,
            createdBy: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        confirmedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { pickedUpAt: 'desc' },
    });

    res.json({ pickupLogs });
  } catch (error: any) {
    console.error('Get pickup logs error:', error);
    res.status(500).json({ error: 'Failed to fetch pickup logs', details: error.message });
  }
});

// Create pickup log (confirm pickup)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const {
      projectId,
      takerName,
      takerInstitution,
      takerPhone,
      notes,
    } = req.body;

    if (!projectId || !takerName) {
      return res.status(400).json({ 
        error: 'Missing required fields: projectId, takerName' 
      });
    }

    // Only designer_external or admin can confirm pickup
    if (currentUser.role !== 'designer_external' && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only percetakan can confirm pickup' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.status !== 'ready') {
      return res.status(400).json({ error: 'Project must be ready (selesai dicetak) first' });
    }

    const pickupLog = await prisma.pickupLog.create({
      data: {
        projectId,
        takerName,
        takerInstitution,
        takerPhone,
        notes,
        confirmedById: currentUser.id,
        pickedUpAt: new Date(),
      },
      include: {
        project: true,
        confirmedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Update project status to picked_up
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'picked_up' },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'pickup_confirmed',
        description: `Project "${project.title}" picked up by ${takerName}`,
        userId: currentUser.id,
        projectId,
      },
    });

    // Notify requester
    if (project.createdById) {
      await prisma.notification.create({
        data: {
          userId: project.createdById,
          type: 'pickup_confirmed',
          title: 'Sudah Diambil',
          message: `Proyek "${project.title}" telah diambil oleh ${takerName}`,
          data: JSON.stringify({ projectId, pickupLogId: pickupLog.id }),
        },
      });
    }

    res.status(201).json({ pickupLog });
  } catch (error: any) {
    console.error('Create pickup log error:', error);
    res.status(500).json({ error: 'Failed to create pickup log', details: error.message });
  }
});

// Get pickup logs for a project
router.get('/project/:projectId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;

    const pickupLogs = await prisma.pickupLog.findMany({
      where: { projectId },
      include: {
        confirmedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { pickedUpAt: 'desc' },
    });

    res.json({ pickupLogs });
  } catch (error: any) {
    console.error('Get pickup logs error:', error);
    res.status(500).json({ error: 'Failed to fetch pickup logs', details: error.message });
  }
});

// Get single pickup log
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const pickupLog = await prisma.pickupLog.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            institution: true,
          },
        },
        confirmedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    if (!pickupLog) {
      return res.status(404).json({ error: 'Pickup log not found' });
    }

    res.json({ pickupLog });
  } catch (error: any) {
    console.error('Get pickup log error:', error);
    res.status(500).json({ error: 'Failed to fetch pickup log', details: error.message });
  }
});

// Update pickup log
router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;
    const { takerName, takerInstitution, takerPhone, notes } = req.body;

    // Only confirmer or admin can update
    const pickupLog = await prisma.pickupLog.findUnique({ where: { id } });
    if (!pickupLog) {
      return res.status(404).json({ error: 'Pickup log not found' });
    }

    if (pickupLog.confirmedById !== currentUser.id && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updateData: any = {};
    if (takerName !== undefined) updateData.takerName = takerName;
    if (takerInstitution !== undefined) updateData.takerInstitution = takerInstitution;
    if (takerPhone !== undefined) updateData.takerPhone = takerPhone;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.pickupLog.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        confirmedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    res.json({ pickupLog: updated });
  } catch (error: any) {
    console.error('Update pickup log error:', error);
    res.status(500).json({ error: 'Failed to update pickup log', details: error.message });
  }
});

export default router;
