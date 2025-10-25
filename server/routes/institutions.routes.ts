import { Router } from 'express';
import prisma from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all institutions
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const institutions = await prisma.institution.findMany({
      include: {
        _count: {
          select: {
            projects: true,
            users: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({ institutions });
  } catch (error: any) {
    console.error('Get institutions error:', error);
    res.status(500).json({ error: 'Failed to fetch institutions', details: error.message });
  }
});

// Get institution by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const institution = await prisma.institution.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            createdBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        users: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    res.json({ institution });
  } catch (error: any) {
    console.error('Get institution error:', error);
    res.status(500).json({ error: 'Failed to fetch institution', details: error.message });
  }
});

// Create institution (admin only)
router.post('/', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { name, type, address, phone, email } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const institution = await prisma.institution.create({
      data: {
        name,
        type,
        address,
        phone,
        email,
      },
    });

    res.status(201).json({ institution });
  } catch (error: any) {
    console.error('Create institution error:', error);
    res.status(500).json({ error: 'Failed to create institution', details: error.message });
  }
});

// Update institution (admin only)
router.patch('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, type, address, phone, email } = req.body;

    const institution = await prisma.institution.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
      },
    });

    res.json({ institution });
  } catch (error: any) {
    console.error('Update institution error:', error);
    res.status(500).json({ error: 'Failed to update institution', details: error.message });
  }
});

// Delete institution (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.institution.delete({ where: { id } });

    res.json({ message: 'Institution deleted successfully' });
  } catch (error: any) {
    console.error('Delete institution error:', error);
    res.status(500).json({ error: 'Failed to delete institution', details: error.message });
  }
});

export default router;
