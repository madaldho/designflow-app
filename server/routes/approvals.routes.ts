import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Approve project for print (final approval by approver/atasan)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const {
      projectId,
      status, // 'approved' or 'rejected'
      comment,
    } = req.body;

    if (!projectId || !status) {
      return res.status(400).json({ 
        error: 'Missing required fields: projectId, status' 
      });
    }

    // Only approver or admin can approve for print
    if (currentUser.role !== 'approver' && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only approver or admin can approve for print' });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create approval record
    const approval = await prisma.approval.create({
      data: {
        projectId,
        approverId: currentUser.id,
        status,
        comment,
        approvedAt: status === 'approved' ? new Date() : null,
      },
      include: {
        approver: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Update project status
    let newStatus = project.status;
    if (status === 'approved') {
      newStatus = 'approved_for_print'; // Siap Cetak (HIJAU)
    } else if (status === 'rejected') {
      newStatus = 'changes_requested'; // Kembali ke revisi
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status: newStatus },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: status === 'approved' ? 'approved_for_print' : 'approval_rejected',
        description: status === 'approved' 
          ? `Approved project "${project.title}" for print (SIAP CETAK)` 
          : `Rejected project "${project.title}"`,
        userId: currentUser.id,
        projectId,
      },
    });

    // Send notifications
    const notifyUsers: string[] = [];
    
    // Notify designer
    if (project.assigneeId) notifyUsers.push(project.assigneeId);
    
    // Notify requester
    if (project.createdById) notifyUsers.push(project.createdById);

    for (const userId of notifyUsers) {
      await prisma.notification.create({
        data: {
          userId,
          type: status === 'approved' ? 'approved_for_print' : 'approval_rejected',
          title: status === 'approved' ? 'Disetujui untuk Cetak' : 'Approval Ditolak',
          message: status === 'approved'
            ? `Proyek "${project.title}" telah disetujui untuk cetak (SIAP CETAK)`
            : `Proyek "${project.title}" perlu perbaikan`,
          data: JSON.stringify({ projectId, approvalId: approval.id }),
        },
      });
    }

    res.status(201).json({ approval });
  } catch (error: any) {
    console.error('Create approval error:', error);
    res.status(500).json({ error: 'Failed to create approval', details: error.message });
  }
});

// Get approvals for a project
router.get('/project/:projectId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;

    const approvals = await prisma.approval.findMany({
      where: { projectId },
      include: {
        approver: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ approvals });
  } catch (error: any) {
    console.error('Get approvals error:', error);
    res.status(500).json({ error: 'Failed to fetch approvals', details: error.message });
  }
});

// Get single approval
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const approval = await prisma.approval.findUnique({
      where: { id },
      include: {
        approver: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        project: {
          select: { id: true, title: true, status: true },
        },
      },
    });

    if (!approval) {
      return res.status(404).json({ error: 'Approval not found' });
    }

    res.json({ approval });
  } catch (error: any) {
    console.error('Get approval error:', error);
    res.status(500).json({ error: 'Failed to fetch approval', details: error.message });
  }
});

export default router;
