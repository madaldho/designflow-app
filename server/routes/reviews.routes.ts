import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Create annotation on proof
router.post('/annotations', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const {
      proofId,
      type,
      coordinates,
      comment,
    } = req.body;

    if (!proofId || !type || !coordinates) {
      return res.status(400).json({ 
        error: 'Missing required fields: proofId, type, coordinates' 
      });
    }

    // Check if user can annotate (reviewer, approver, admin)
    const canAnnotate = ['reviewer', 'approver', 'admin'].includes(currentUser.role);
    if (!canAnnotate) {
      return res.status(403).json({ error: 'Only reviewer, approver, or admin can annotate' });
    }

    const annotation = await prisma.annotation.create({
      data: {
        proofId,
        type,
        coordinates,
        comment,
        createdById: currentUser.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Get proof and project info
    const proof = await prisma.proof.findUnique({
      where: { id: proofId },
      include: { project: true },
    });

    // Log activity
    if (proof) {
      await prisma.activity.create({
        data: {
          type: 'annotation_added',
          description: `Added annotation to proof v${proof.version}`,
          userId: currentUser.id,
          projectId: proof.projectId,
        },
      });

      // Notify designer
      if (proof.project.assigneeId) {
        await prisma.notification.create({
          data: {
            userId: proof.project.assigneeId,
            type: 'annotation_added',
            title: 'Komentar Baru',
            message: `Ada komentar baru di proyek "${proof.project.title}"`,
            data: JSON.stringify({ projectId: proof.projectId, proofId }),
          },
        });
      }
    }

    res.status(201).json({ annotation });
  } catch (error: any) {
    console.error('Create annotation error:', error);
    res.status(500).json({ error: 'Failed to create annotation', details: error.message });
  }
});

// Get annotations for a proof
router.get('/annotations/proof/:proofId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { proofId } = req.params;

    const annotations = await prisma.annotation.findMany({
      where: { proofId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ annotations });
  } catch (error: any) {
    console.error('Get annotations error:', error);
    res.status(500).json({ error: 'Failed to fetch annotations', details: error.message });
  }
});

// Update annotation
router.patch('/annotations/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;
    const { comment, status } = req.body;

    const annotation = await prisma.annotation.findUnique({ where: { id } });
    if (!annotation) {
      return res.status(404).json({ error: 'Annotation not found' });
    }

    // Only creator or admin can update
    if (annotation.createdById !== currentUser.id && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updateData: any = {};
    if (comment !== undefined) updateData.comment = comment;
    if (status !== undefined) updateData.status = status;

    const updated = await prisma.annotation.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    res.json({ annotation: updated });
  } catch (error: any) {
    console.error('Update annotation error:', error);
    res.status(500).json({ error: 'Failed to update annotation', details: error.message });
  }
});

// Delete annotation
router.delete('/annotations/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;

    const annotation = await prisma.annotation.findUnique({ where: { id } });
    if (!annotation) {
      return res.status(404).json({ error: 'Annotation not found' });
    }

    // Only creator or admin can delete
    if (annotation.createdById !== currentUser.id && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.annotation.delete({ where: { id } });

    res.json({ message: 'Annotation deleted successfully' });
  } catch (error: any) {
    console.error('Delete annotation error:', error);
    res.status(500).json({ error: 'Failed to delete annotation', details: error.message });
  }
});

// Submit review (approve or request changes)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const {
      projectId,
      proofId,
      decision, // 'approved' or 'changes_requested'
      comment,
      changeRequests,
    } = req.body;

    if (!projectId || !proofId || !decision) {
      return res.status(400).json({ 
        error: 'Missing required fields: projectId, proofId, decision' 
      });
    }

    // Check if user can review
    const canReview = ['reviewer', 'approver', 'admin'].includes(currentUser.role);
    if (!canReview) {
      return res.status(403).json({ error: 'Only reviewer, approver, or admin can review' });
    }

    const review = await prisma.review.create({
      data: {
        projectId,
        proofId,
        reviewerId: currentUser.id,
        decision,
        comment,
        changeRequests,
        reviewedAt: new Date(),
      },
      include: {
        reviewer: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Update project status based on decision
    let newStatus = 'ready_for_review';
    if (decision === 'approved' && currentUser.role === 'reviewer') {
      newStatus = 'approved'; // Reviewer approved, wait for approver
    } else if (decision === 'changes_requested') {
      newStatus = 'changes_requested';
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status: newStatus },
    });

    // Get project for notifications
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: decision === 'approved' ? 'review_approved' : 'changes_requested',
        description: decision === 'approved' 
          ? `Approved proof for project "${project?.title}"` 
          : `Requested changes for project "${project?.title}"`,
        userId: currentUser.id,
        projectId,
      },
    });

    // Send notification to designer
    if (project?.assigneeId) {
      await prisma.notification.create({
        data: {
          userId: project.assigneeId,
          type: decision === 'approved' ? 'review_approved' : 'changes_requested',
          title: decision === 'approved' ? 'Review Disetujui' : 'Perlu Revisi',
          message: decision === 'approved' 
            ? `Proyek "${project.title}" telah disetujui reviewer`
            : `Proyek "${project.title}" perlu revisi`,
          data: JSON.stringify({ projectId, reviewId: review.id }),
        },
      });
    }

    res.status(201).json({ review });
  } catch (error: any) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review', details: error.message });
  }
});

// Get reviews for a project
router.get('/project/:projectId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { projectId },
      include: {
        reviewer: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        proof: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ reviews });
  } catch (error: any) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
  }
});

export default router;
