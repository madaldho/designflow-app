import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMCPQueries() {
  try {
    console.log('🔍 Testing MCP-style database queries...\n');
    
    // Query 1: Get all users with their roles
    console.log('📋 Query 1: All users with roles');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        institutions: {
          select: {
            id: true,
            name: true,
            type: true,
          }
        }
      }
    });
    console.log(JSON.stringify(users, null, 2));
    console.log(`\n✅ Found ${users.length} users\n`);
    
    // Query 2: Get projects with creator info
    console.log('📋 Query 2: Projects with creator info');
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        type: true,
        deadline: true,
        createdBy: {
          select: {
            name: true,
            email: true,
            role: true,
          }
        },
        institution: {
          select: {
            name: true,
            type: true,
          }
        }
      }
    });
    console.log(JSON.stringify(projects, null, 2));
    console.log(`\n✅ Found ${projects.length} projects\n`);
    
    // Query 3: Get recent notifications
    console.log('📋 Query 3: Recent notifications');
    const notifications = await prisma.notification.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
        read: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
    console.log(JSON.stringify(notifications, null, 2));
    console.log(`\n✅ Found ${notifications.length} recent notifications\n`);
    
    // Query 4: Database stats
    console.log('📊 Database Statistics:');
    const stats = {
      users: await prisma.user.count(),
      projects: await prisma.project.count(),
      notifications: await prisma.notification.count(),
      institutions: await prisma.institution.count(),
      approvals: await prisma.approval.count(),
      reviews: await prisma.review.count(),
      printJobs: await prisma.printJob.count(),
      proofs: await prisma.proof.count(),
    };
    console.log(JSON.stringify(stats, null, 2));
    
    console.log('\n✅ All MCP-style queries completed successfully!');
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Query failed:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testMCPQueries();
