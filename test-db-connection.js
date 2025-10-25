import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    // Try to connect
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
    const projectCount = await prisma.project.count();
    console.log(`✅ Found ${projectCount} projects in database`);
    
    const notificationCount = await prisma.notification.count();
    console.log(`✅ Found ${notificationCount} notifications in database`);
    
    console.log('\n🎉 Database connection is working perfectly!');
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'P1001') {
      console.error('\n📡 Network error - Cannot reach database server');
      console.error('Possible causes:');
      console.error('  1. Database URL is incorrect');
      console.error('  2. Database server is down');
      console.error('  3. Firewall blocking connection');
    } else if (error.code === 'P1003') {
      console.error('\n🔐 Authentication error - Invalid credentials');
    } else if (error.code === 'P1017') {
      console.error('\n⏱️  Connection timeout - Database took too long to respond');
    }
    
    process.exit(1);
  }
}

testConnection();
