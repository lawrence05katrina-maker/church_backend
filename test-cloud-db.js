const { Pool } = require('pg');
require('dotenv').config();

async function testCloudDatabase() {
  console.log('🔍 Testing Cloud Database Connection...\n');
  
  // Check if DATABASE_URL is configured
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.log('💡 Make sure to set DATABASE_URL in your .env file');
    return;
  }
  
  console.log('✅ DATABASE_URL found in environment');
  console.log('🔗 Connecting to:', process.env.DATABASE_URL.replace(/:([^:@]{8})[^:@]*@/, ':****@'));
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    // Test current time
    const timeResult = await client.query('SELECT NOW() as current_time');
    console.log('📅 Current database time:', timeResult.rows[0].current_time);
    
    // Test database info
    const dbResult = await client.query('SELECT current_database() as db_name, current_user as user_name');
    console.log('🗄️  Database:', dbResult.rows[0].db_name);
    console.log('👤 User:', dbResult.rows[0].user_name);
    
    // List tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📋 Available tables:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('   No tables found. You may need to run your database schema.');
    }
    
    // Test a simple query on a common table
    try {
      const countResult = await client.query('SELECT COUNT(*) as count FROM admins');
      console.log(`\n👥 Admin users count: ${countResult.rows[0].count}`);
    } catch (err) {
      console.log('\n⚠️  Admin table not found or empty - this is normal for a new database');
    }
    
    client.release();
    console.log('\n🎉 Cloud database connection test completed successfully!');
    
  } catch (err) {
    console.error('\n❌ Database connection failed:');
    console.error('Error:', err.message);
    
    if (err.message.includes('password authentication failed')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check your DATABASE_URL username and password');
      console.log('   - Verify the credentials in your Render database dashboard');
    } else if (err.message.includes('does not exist')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check your database name in the DATABASE_URL');
      console.log('   - Verify the database exists in your Render dashboard');
    } else if (err.message.includes('ENOTFOUND')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   - Check your DATABASE_URL hostname');
      console.log('   - Verify network connectivity');
    }
  } finally {
    await pool.end();
  }
}

// Run the test
testCloudDatabase().catch(console.error);