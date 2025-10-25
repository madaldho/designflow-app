import bcrypt from 'bcryptjs';
import prisma from './config/database';

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.activity.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.review.deleteMany();
  await prisma.annotation.deleteMany();
  await prisma.proof.deleteMany();
  await prisma.projectAsset.deleteMany();
  await prisma.printJob.deleteMany();
  await prisma.pickupLog.deleteMany();
  await prisma.project.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Institutions
  console.log('Creating institutions...');
  const institutions = await Promise.all([
    prisma.institution.create({
      data: {
        name: 'Pondok Pesantren Al-Ihsan',
        type: 'pondok',
        address: 'Jl. Raya Bogor No. 123',
        phone: '021-12345678',
        email: 'info@al-ihsan.sch.id',
      },
    }),
    prisma.institution.create({
      data: {
        name: 'SMA Negeri 1 Jakarta',
        type: 'sma',
        address: 'Jl. Sudirman No. 456',
        phone: '021-87654321',
        email: 'contact@sman1jkt.sch.id',
      },
    }),
    prisma.institution.create({
      data: {
        name: 'Yayasan Pendidikan Maju Bersama',
        type: 'yayasan',
        address: 'Jl. Gatot Subroto No. 789',
        phone: '021-55555555',
      },
    }),
  ]);

  // Create Users
  console.log('Creating users...');
  
  // Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Designflow',
      email: 'admin@designflow.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      phone: '081234567890',
      institutions: {
        connect: [],
      },
    },
  });

  // Approver
  const approver = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'budi@designflow.com',
      password: hashedPassword,
      role: 'approver',
      status: 'active',
      phone: '081234567891',
    },
  });

  // Reviewer
  const reviewer = await prisma.user.create({
    data: {
      name: 'Siti Nurjanah',
      email: 'siti@designflow.com',
      password: hashedPassword,
      role: 'reviewer',
      status: 'active',
      phone: '081234567892',
    },
  });

  // Internal Designer
  const designer1 = await prisma.user.create({
    data: {
      name: 'Ahmad Fauzi',
      email: 'ahmad@designflow.com',
      password: hashedPassword,
      role: 'designer_internal',
      status: 'active',
      phone: '081234567893',
    },
  });

  // External Designer
  const designer2 = await prisma.user.create({
    data: {
      name: 'Dewi Lestari',
      email: 'dewi@designflow.com',
      password: hashedPassword,
      role: 'designer_external',
      status: 'active',
      phone: '081234567894',
    },
  });

  // Requesters
  const requester1 = await prisma.user.create({
    data: {
      name: 'Hasan Ibrahim',
      email: 'hasan@al-ihsan.sch.id',
      password: hashedPassword,
      role: 'requester',
      status: 'active',
      phone: '081234567895',
      institutions: {
        connect: [{ id: institutions[0].id }],
      },
    },
  });

  const requester2 = await prisma.user.create({
    data: {
      name: 'Rina Kusuma',
      email: 'rina@sman1jkt.sch.id',
      password: hashedPassword,
      role: 'requester',
      status: 'active',
      phone: '081234567896',
      institutions: {
        connect: [{ id: institutions[1].id }],
      },
    },
  });

  // Create Projects with various statuses
  console.log('Creating projects...');

  // Draft project
  const project1 = await prisma.project.create({
    data: {
      title: 'Spanduk Kegiatan Ramadhan 2024',
      description: 'Spanduk untuk kegiatan pesantren selama bulan Ramadhan',
      brief: 'Desain yang islami dengan tema hijau dan gold',
      type: 'spanduk',
      size: '3x1 meter',
      quantity: 2,
      deadline: new Date('2024-12-31'),
      status: 'draft',
      createdById: requester1.id,
      institutionId: institutions[0].id,
    },
  });

  // Designing project with assignee
  const project2 = await prisma.project.create({
    data: {
      title: 'Poster Penerimaan Siswa Baru 2025',
      description: 'Poster untuk promosi PSB tahun ajaran baru',
      type: 'poster',
      size: 'A3',
      quantity: 50,
      deadline: new Date('2025-01-15'),
      status: 'designing',
      createdById: requester2.id,
      institutionId: institutions[1].id,
      assigneeId: designer1.id,
    },
  });

  // Ready for review
  const project3 = await prisma.project.create({
    data: {
      title: 'Brosur Program Beasiswa',
      description: 'Brosur informasi program beasiswa untuk siswa berprestasi',
      type: 'brosur',
      size: 'A4',
      quantity: 100,
      deadline: new Date('2025-02-01'),
      status: 'ready_for_review',
      createdById: requester1.id,
      institutionId: institutions[0].id,
      assigneeId: designer2.id,
      reviewerId: reviewer.id,
    },
  });

  // Approved project
  const project4 = await prisma.project.create({
    data: {
      title: 'Banner Website Sekolah',
      description: 'Banner untuk halaman utama website sekolah',
      type: 'baliho',
      size: '1920x1080 px',
      quantity: 1,
      deadline: new Date('2024-12-20'),
      status: 'approved',
      createdById: requester2.id,
      institutionId: institutions[1].id,
      assigneeId: designer1.id,
      reviewerId: reviewer.id,
      approverId: approver.id,
    },
  });

  // In print project
  const project5 = await prisma.project.create({
    data: {
      title: 'Kartu Nama Staff Pengajar',
      description: 'Kartu nama untuk seluruh staff pengajar',
      type: 'kartu_nama',
      size: '9x5 cm',
      quantity: 200,
      deadline: new Date('2024-12-25'),
      status: 'in_print',
      createdById: requester2.id,
      institutionId: institutions[1].id,
      assigneeId: designer1.id,
      reviewerId: reviewer.id,
      approverId: approver.id,
    },
  });

  // Create Activities
  console.log('Creating activities...');
  await Promise.all([
    prisma.activity.create({
      data: {
        type: 'project_created',
        description: `Created project "${project1.title}"`,
        userId: requester1.id,
        projectId: project1.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'project_created',
        description: `Created project "${project2.title}"`,
        userId: requester2.id,
        projectId: project2.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'project_assigned',
        description: `Assigned ${designer1.name} to project "${project2.title}"`,
        userId: approver.id,
        projectId: project2.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'project_status_changed',
        description: `Project "${project3.title}" moved to ready_for_review`,
        userId: designer2.id,
        projectId: project3.id,
      },
    }),
    prisma.activity.create({
      data: {
        type: 'project_approved',
        description: `Project "${project4.title}" has been approved`,
        userId: approver.id,
        projectId: project4.id,
      },
    }),
  ]);

  // Create Notifications
  console.log('Creating notifications...');
  await Promise.all([
    // Admin notifications
    prisma.notification.create({
      data: {
        userId: admin.id,
        type: 'welcome',
        title: 'Selamat Datang Admin!',
        message: 'Anda memiliki akses penuh ke sistem DesignFlow.',
        read: false,
        channels: 'email',
      },
    }),
    // Requester notifications
    prisma.notification.create({
      data: {
        userId: requester1.id,
        type: 'info',
        title: 'Proyek Anda Sedang Dikerjakan',
        message: `Proyek "${project1.title}" sedang dalam tahap desain.`,
        read: false,
        channels: 'email,whatsapp',
        data: JSON.stringify({ projectId: project1.id }),
      },
    }),
    prisma.notification.create({
      data: {
        userId: requester1.id,
        type: 'proof_uploaded',
        title: 'Proof Baru Tersedia',
        message: `Desainer telah mengupload versi baru untuk proyek "${project2.title}".`,
        read: true,
        channels: 'email',
        data: JSON.stringify({ projectId: project2.id }),
      },
    }),
    // Designer notifications
    prisma.notification.create({
      data: {
        userId: designer1.id,
        type: 'project_assigned',
        title: 'Proyek Baru Ditugaskan',
        message: `Anda ditugaskan untuk mengerjakan proyek "${project1.title}".`,
        read: false,
        channels: 'email,whatsapp',
        data: JSON.stringify({ projectId: project1.id }),
      },
    }),
    prisma.notification.create({
      data: {
        userId: designer1.id,
        type: 'changes_requested',
        title: 'Perlu Revisi',
        message: `Proyek "${project3.title}" memerlukan revisi dari reviewer.`,
        read: false,
        channels: 'email,whatsapp',
        data: JSON.stringify({ projectId: project3.id }),
      },
    }),
    // Reviewer notifications
    prisma.notification.create({
      data: {
        userId: reviewer.id,
        type: 'review_needed',
        title: 'Review Diperlukan',
        message: `Proyek "${project2.title}" siap untuk direview.`,
        read: false,
        channels: 'email',
        data: JSON.stringify({ projectId: project2.id }),
      },
    }),
    prisma.notification.create({
      data: {
        userId: reviewer.id,
        type: 'proof_uploaded',
        title: 'Proof Baru Tersedia',
        message: `Versi baru telah diupload untuk proyek "${project1.title}".`,
        read: true,
        channels: 'email',
        data: JSON.stringify({ projectId: project1.id }),
      },
    }),
    // Approver notifications
    prisma.notification.create({
      data: {
        userId: approver.id,
        type: 'approval_needed',
        title: 'Approval Diperlukan',
        message: `Proyek "${project4.title}" menunggu approval untuk cetak.`,
        read: false,
        channels: 'email',
        data: JSON.stringify({ projectId: project4.id }),
      },
    }),
    // Percetakan notifications
    prisma.notification.create({
      data: {
        userId: designer2.id,
        type: 'approved_for_print',
        title: 'Siap Cetak',
        message: `Proyek "${project4.title}" telah disetujui untuk cetak.`,
        read: false,
        channels: 'email,whatsapp',
        data: JSON.stringify({ projectId: project4.id }),
      },
    }),
    prisma.notification.create({
      data: {
        userId: designer2.id,
        type: 'print_started',
        title: 'Sedang Dicetak',
        message: `Proyek "${project5.title}" sedang dalam proses cetak.`,
        read: true,
        channels: 'email',
        data: JSON.stringify({ projectId: project5.id }),
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Demo Accounts:');
  console.log('-------------------');
  console.log('Admin:');
  console.log('  Email: admin@designflow.com');
  console.log('  Password: password123');
  console.log('\nApprover:');
  console.log('  Email: budi@designflow.com');
  console.log('  Password: password123');
  console.log('\nReviewer:');
  console.log('  Email: siti@designflow.com');
  console.log('  Password: password123');
  console.log('\nDesigner (Internal):');
  console.log('  Email: ahmad@designflow.com');
  console.log('  Password: password123');
  console.log('\nDesigner (External):');
  console.log('  Email: dewi@designflow.com');
  console.log('  Password: password123');
  console.log('\nRequester 1:');
  console.log('  Email: hasan@al-ihsan.sch.id');
  console.log('  Password: password123');
  console.log('\nRequester 2:');
  console.log('  Email: rina@sman1jkt.sch.id');
  console.log('  Password: password123');
  console.log('\n🎉 Total: 7 users, 3 institutions, 5 projects');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
