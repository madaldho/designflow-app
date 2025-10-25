import prisma from '../config/database';

async function seedNotifications() {
  try {
    console.log('🌱 Seeding notifications...');

    // Get all users
    const users = await prisma.user.findMany();
    
    if (users.length === 0) {
      console.log('❌ No users found. Please seed users first.');
      return;
    }

    // Get some projects
    const projects = await prisma.project.findMany({
      take: 5,
    });

    const notifications = [];

    // Create notifications for each user
    for (const user of users) {
      // Welcome notification
      notifications.push({
        userId: user.id,
        type: 'welcome',
        title: 'Selamat Datang!',
        message: `Halo ${user.name}, selamat datang di DesignFlow. Mulai kelola proyek desain Anda dengan mudah.`,
        read: false,
        channels: 'email,whatsapp',
      });

      // Role-specific notifications
      if (user.role === 'requester') {
        notifications.push({
          userId: user.id,
          type: 'info',
          title: 'Mulai Proyek Baru',
          message: 'Klik tombol "+ Request Desain" untuk membuat permintaan desain baru.',
          read: false,
          channels: 'email',
        });
      } else if (user.role === 'designer_internal' || user.role === 'designer_external') {
        notifications.push({
          userId: user.id,
          type: 'info',
          title: 'Proyek Menunggu',
          message: 'Anda memiliki proyek yang perlu dikerjakan. Cek panel desainer Anda.',
          read: false,
          channels: 'email,whatsapp',
        });
      } else if (user.role === 'reviewer') {
        notifications.push({
          userId: user.id,
          type: 'review_needed',
          title: 'Review Diperlukan',
          message: 'Ada proyek yang menunggu review dari Anda.',
          read: false,
          channels: 'email',
        });
      } else if (user.role === 'approver') {
        notifications.push({
          userId: user.id,
          type: 'approval_needed',
          title: 'Approval Diperlukan',
          message: 'Ada proyek yang menunggu approval untuk cetak.',
          read: false,
          channels: 'email',
        });
      }

      // Add some project-related notifications if projects exist
      if (projects.length > 0 && Math.random() > 0.5) {
        const randomProject = projects[Math.floor(Math.random() * projects.length)];
        notifications.push({
          userId: user.id,
          type: 'project_update',
          title: 'Update Proyek',
          message: `Proyek "${randomProject.title}" telah diupdate. Klik untuk melihat detail.`,
          read: Math.random() > 0.5, // 50% chance already read
          channels: 'email',
          data: JSON.stringify({ projectId: randomProject.id }),
        });
      }
    }

    // Create all notifications
    const created = await prisma.notification.createMany({
      data: notifications,
    });

    console.log(`✅ Created ${created.count} notifications`);

    // Show sample
    const sample = await prisma.notification.findMany({
      take: 5,
      include: {
        user: {
          select: { name: true, role: true },
        },
      },
    });

    console.log('\n📬 Sample notifications:');
    sample.forEach((n) => {
      console.log(`  - ${n.user.name} (${n.user.role}): ${n.title}`);
    });

    console.log('\n🎉 Done seeding notifications!');
  } catch (error) {
    console.error('❌ Error seeding notifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNotifications();
