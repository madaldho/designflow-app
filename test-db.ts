import prisma from './server/config/database.js';

async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...\n');
  
  try {
    // Test 1: Connect to database
    console.log('1️⃣ Testing connection...');
    await prisma.$connect();
    console.log('   ✅ Connected to database successfully\n');

    // Test 2: Count users
    console.log('2️⃣ Counting users...');
    const userCount = await prisma.user.count();
    console.log(`   📊 Total users: ${userCount}\n`);

    // Test 3: Count projects
    console.log('3️⃣ Counting projects...');
    const projectCount = await prisma.project.count();
    console.log(`   📊 Total projects: ${projectCount}\n`);

    // Test 4: Count institutions
    console.log('4️⃣ Counting institutions...');
    const institutionCount = await prisma.institution.count();
    console.log(`   📊 Total institutions: ${institutionCount}\n`);

    // Test 5: Get sample users (if any)
    if (userCount > 0) {
      console.log('5️⃣ Fetching sample users...');
      const users = await prisma.user.findMany({
        take: 3,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
        }
      });
      console.log('   👥 Sample users:');
      console.table(users);
    }

    // Test 6: Database info
    console.log('6️⃣ Database Information:');
    console.log('   📍 Database: PostgreSQL (Neon)');
    console.log('   🌍 Region: ap-southeast-1');
    console.log('   🔗 Connection: Pooler');
    console.log('   🔒 SSL: Required\n');

    console.log('✅ All tests passed!\n');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('👋 Disconnected from database');
  }
}

testDatabaseConnection();
