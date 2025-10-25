import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Upload new proof version
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user!;
    const {
      projectId,
      fileUrl,
      fileName,
      fileSize,
      mimeType,
      notes,
      isFinal = false,
    } = req.body;

    if (!projectId || !fileUrl || !fileName) {
      return res.status(400).json({ 
        error: 'Missing required fields: projectId, fileUrl, fileName' 
      });
    }

    // Check project exists and user has permission to upload
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only assignee (designer) or admin can upload proof
    const canUpload = 
      currentUser.role === 'admin' ||
      project.assigneeId === currentUser.id;

    if (!canUpload) {
      return res.status(403).json({ error: 'Only assigned designer can upload proof' });
    }

    // Get current max version
    const latestProof = await prisma.proof.findFirst({
      where: { projectId },
      orderBy: { version: 'desc' },
    });

    const newVersion = latestProof ? latestProof.version + 1 : 1;

    // Create proof
    const proof = await prisma.proof.create({
      data: {
        projectId,
        version: newVersion,
        fileUrl,
        fileName,
        fileSize: parseInt(fileSize) || 0,
        mimeType,
        notes,
        isFinal,
        uploadedById: currentUser.id,
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    // Update project version
    await prisma.project.update({
      where: { id: projectId },
      data: { 
        version: newVersion,
        status: 'ready_for_review', // Auto set to ready for review
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: 'proof_uploaded',
        description: `Uploaded proof v${newVersion} for project "${project.title}"`,
        userId: currentUser.id,
        projectId,
      },
    });

    // Create notification for reviewer
    if (project.reviewerId) {
      await prisma.notification.create({
        data: {
          userId: project.reviewerId,
          type: 'proof_uploaded',
          title: 'Proof Baru Tersedia',
          message: `Versi ${newVersion} untuk proyek "${project.title}" siap untuk direview`,
          data: JSON.stringify({ projectId, proofId: proof.id }),
        },
      });
    }

    res.status(201).json({ proof });
  } catch (error: any) {
    console.error('Upload proof error:', error);
    res.status(500).json({ error: 'Failed to upload proof', details: error.message });
  }
});

// Get proofs for a project
router.get('/project/:projectId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;

    const proofs = await prisma.proof.findMany({
      where: { projectId },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        annotations: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
      },
      orderBy: { version: 'desc' },
    });

    res.json({ proofs });
  } catch (error: any) {
    console.error('Get proofs error:', error);
    res.status(500).json({ error: 'Failed to fetch proofs', details: error.message });
  }
});

// Get single proof
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const proof = await prisma.proof.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        project: {
          select: { id: true, title: true, status: true },
        },
        annotations: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!proof) {
      return res.status(404).json({ error: 'Proof not found' });
    }

    res.json({ proof });
  } catch (error: any) {
    console.error('Get proof error:', error);
    res.status(500).json({ error: 'Failed to fetch proof', details: error.message });
  }
});

// Delete proof
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user!;

    const proof = await prisma.proof.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!proof) {
      return res.status(404).json({ error: 'Proof not found' });
    }

    // Only uploader or admin can delete
    if (proof.uploadedById !== currentUser.id && currentUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.proof.delete({ where: { id } });

    res.json({ message: 'Proof deleted successfully' });
  } catch (error: any) {
    console.error('Delete proof error:', error);
    res.status(500).json({ error: 'Failed to delete proof', details: error.message });
  }
});

export default router;
