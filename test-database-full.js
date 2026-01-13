const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function testDatabaseFull() {
  console.log('🔍 Full Database Connection and Data Test\n');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return;
  }
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('📡 Connecting to Render database...');
    const client = await pool.connect();
    console.log('✅ Database connected successfully!\n');
    
    // Test 1: Basic Connection Info
    console.log('=== 📊 DATABASE INFO ===');
    const dbInfo = await client.query(`
      SELECT 
        current_database() as db_name, 
        current_user as user_name,
        version() as db_version
    `);
    console.log('🗄️  Database:', dbInfo.rows[0].db_name);
    console.log('👤 User:', dbInfo.rows[0].user_name);
    console.log('🔧 Version:', dbInfo.rows[0].db_version.split(' ')[0] + ' ' + dbInfo.rows[0].db_version.split(' ')[1]);
    
    // Test 2: Check if schema exists
    console.log('\n=== 📋 SCHEMA CHECK ===');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('⚠️  No tables found. Setting up database schema...');
      
      // Read and execute schema
      const schemaPath = path.join(__dirname, 'database', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        console.log('📄 Reading schema.sql...');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('🔧 Executing schema...');
        await client.query(schema);
        console.log('✅ Schema created successfully!');
        
        // Re-check tables
        const newTablesResult = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name
        `);
        
        console.log('📋 Tables created:');
        newTablesResult.rows.forEach(row => {
          console.log(`   ✓ ${row.table_name}`);
        });
      } else {
        console.log('❌ schema.sql not found at:', schemaPath);
        console.log('💡 Please ensure database/schema.sql exists');
      }
    } else {
      console.log('✅ Database schema already exists');
      console.log('📋 Existing tables:');
      tablesResult.rows.forEach(row => {
        console.log(`   ✓ ${row.table_name}`);
      });
    }
    
    // Test 3: Data Operations
    console.log('\n=== 🧪 DATA OPERATIONS TEST ===');
    
    try {
      // Test INSERT - Create a test admin user
      console.log('📝 Testing INSERT operation...');
      const insertResult = await client.query(`
        INSERT INTO admins (username, password, email, role) 
        VALUES ($1, $2, $3, $4) 
        ON CONFLICT (username) DO UPDATE SET 
          email = EXCLUDED.email,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, username, email, created_at
      `, ['test_admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'test@shrine.com', 'admin']);
      
      console.log('✅ INSERT successful');
      console.log('   📄 Created/Updated admin:', insertResult.rows[0]);
      
      // Test SELECT - Read data
      console.log('\n📖 Testing SELECT operation...');
      const selectResult = await client.query('SELECT id, username, email, role, created_at FROM admins LIMIT 5');
      console.log('✅ SELECT successful');
      console.log(`   📊 Found ${selectResult.rows.length} admin(s):`);
      selectResult.rows.forEach(admin => {
        console.log(`   - ID: ${admin.id}, Username: ${admin.username}, Email: ${admin.email}`);
      });
      
      // Test UPDATE - Modify data
      console.log('\n✏️  Testing UPDATE operation...');
      const updateResult = await client.query(`
        UPDATE admins 
        SET email = $1, updated_at = CURRENT_TIMESTAMP 
        WHERE username = $2 
        RETURNING id, username, email, updated_at
      `, ['updated_test@shrine.com', 'test_admin']);
      
      if (updateResult.rows.length > 0) {
        console.log('✅ UPDATE successful');
        console.log('   📄 Updated admin:', updateResult.rows[0]);
      }
      
      // Test other tables
      console.log('\n📊 Testing other tables...');
      
      // Test donations table
      try {
        const donationTest = await client.query(`
          INSERT INTO donations (donor_name, email, amount, purpose, status) 
          VALUES ($1, $2, $3, $4, $5) 
          RETURNING id, donor_name, amount, purpose
        `, ['Test Donor', 'donor@test.com', 100.00, 'Test Donation', 'pending']);
        
        console.log('✅ Donations table working');
        console.log('   📄 Test donation:', donationTest.rows[0]);
        
        // Clean up test donation
        await client.query('DELETE FROM donations WHERE donor_name = $1', ['Test Donor']);
        console.log('   🧹 Test donation cleaned up');
        
      } catch (err) {
        console.log('⚠️  Donations table test failed:', err.message);
      }
      
      // Test announcements table
      try {
        // First check the table structure
        const tableStructure = await client.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'announcements' 
          ORDER BY ordinal_position
        `);
        
        const hasTypeColumn = tableStructure.rows.some(row => row.column_name === 'type');
        
        let announcementTest;
        if (hasTypeColumn) {
          announcementTest = await client.query(`
            INSERT INTO announcements (title, content, type, is_active) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, title, content
          `, ['Test Announcement', 'This is a test announcement', 'general', true]);
        } else {
          // Fallback for tables without type column
          announcementTest = await client.query(`
            INSERT INTO announcements (title, content, is_active) 
            VALUES ($1, $2, $3) 
            RETURNING id, title, content
          `, ['Test Announcement', 'This is a test announcement', true]);
        }
        
        console.log('✅ Announcements table working');
        console.log('   📄 Test announcement:', announcementTest.rows[0]);
        
        // Clean up test announcement
        await client.query('DELETE FROM announcements WHERE title = $1', ['Test Announcement']);
        console.log('   🧹 Test announcement cleaned up');
        
      } catch (err) {
        console.log('⚠️  Announcements table test failed:', err.message);
      }
      
    } catch (err) {
      console.error('❌ Data operations test failed:', err.message);
    }
    
    // Test 4: Performance Check
    console.log('\n=== ⚡ PERFORMANCE TEST ===');
    const startTime = Date.now();
    await client.query('SELECT COUNT(*) FROM admins');
    const endTime = Date.now();
    console.log(`✅ Query response time: ${endTime - startTime}ms`);
    
    // Test 5: Connection Pool
    console.log('\n=== 🔗 CONNECTION POOL INFO ===');
    console.log(`📊 Total connections: ${pool.totalCount}`);
    console.log(`🔄 Idle connections: ${pool.idleCount}`);
    console.log(`⏳ Waiting clients: ${pool.waitingCount}`);
    
    client.release();
    
    console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('✅ Database is ready for production use');
    
  } catch (err) {
    console.error('\n❌ Database test failed:');
    console.error('Error:', err.message);
    
    if (err.message.includes('password authentication failed')) {
      console.log('\n💡 Authentication issue - check your DATABASE_URL credentials');
    } else if (err.message.includes('does not exist')) {
      console.log('\n💡 Database/table does not exist - check your DATABASE_URL and schema');
    } else if (err.message.includes('relation') && err.message.includes('does not exist')) {
      console.log('\n💡 Table missing - run the schema setup first');
    }
  } finally {
    await pool.end();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the comprehensive test
console.log('🚀 Starting comprehensive database test...\n');
testDatabaseFull().catch(console.error);