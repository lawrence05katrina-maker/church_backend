const axios = require('axios');
const fs = require('fs');

// Configuration
const BASE_URL = 'http://localhost:5000';
let testResults = [];
let passedTests = 0;
let totalTests = 0;

// Helper functions
function logTest(testName, method, endpoint, status, success, error = null) {
  totalTests++;
  const result = {
    test: testName,
    method: method,
    endpoint: endpoint,
    status: status,
    success: success,
    error: error,
    timestamp: new Date().toISOString()
  };
  
  testResults.push(result);
  
  if (success) {
    passedTests++;
    console.log(`✅ ${testName} - ${method} ${endpoint} - Status: ${status}`);
  } else {
    console.log(`❌ ${testName} - ${method} ${endpoint} - Status: ${status} - Error: ${error}`);
  }
}

async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method: method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      status: error.response?.status || 'Network Error', 
      error: error.response?.data?.message || error.message 
    };
  }
}

// Test functions
async function testServerHealth() {
  const result = await makeRequest('GET', '/');
  logTest('Server Health Check', 'GET', '/', result.status, result.success, result.error);
}

async function testPrayerRequests() {
  console.log('\n🙏 Testing Prayer Request APIs...');
  
  // GET all prayers
  let result = await makeRequest('GET', '/api/prayers');
  logTest('Get All Prayer Requests', 'GET', '/api/prayers', result.status, result.success, result.error);
  
  // POST new prayer request
  const prayerData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    prayer: 'Test prayer request for API testing'
  };
  
  result = await makeRequest('POST', '/api/prayers', prayerData);
  logTest('Create Prayer Request', 'POST', '/api/prayers', result.status, result.success, result.error);
}

async function testTestimonies() {
  console.log('\n📝 Testing Testimony APIs...');
  
  // GET approved testimonies
  let result = await makeRequest('GET', '/api/testimonies/approved');
  logTest('Get Approved Testimonies', 'GET', '/api/testimonies/approved', result.status, result.success, result.error);
  
  // POST new testimony
  const testimonyData = {
    name: 'Test User',
    email: 'test@example.com',
    testimony: 'This is a test testimony for API testing'
  };
  
  result = await makeRequest('POST', '/api/testimonies', testimonyData);
  logTest('Create Testimony', 'POST', '/api/testimonies', result.status, result.success, result.error);
}

async function testGallery() {
  console.log('\n🖼️ Testing Gallery APIs...');
  
  // GET public gallery
  let result = await makeRequest('GET', '/api/gallery/public');
  logTest('Get Public Gallery', 'GET', '/api/gallery/public', result.status, result.success, result.error);
}

async function testLivestream() {
  console.log('\n📺 Testing Livestream APIs...');
  
  // GET active livestream
  let result = await makeRequest('GET', '/api/livestream/active');
  logTest('Get Active Livestream', 'GET', '/api/livestream/active', result.status, result.success, result.error);
  
  // GET upcoming livestreams
  result = await makeRequest('GET', '/api/livestream/upcoming');
  logTest('Get Upcoming Livestreams', 'GET', '/api/livestream/upcoming', result.status, result.success, result.error);
}

async function testContact() {
  console.log('\n📞 Testing Contact APIs...');
  
  // GET contact info
  let result = await makeRequest('GET', '/api/contact');
  logTest('Get Contact Info', 'GET', '/api/contact', result.status, result.success, result.error);
}

async function testAnnouncements() {
  console.log('\n📢 Testing Announcement APIs...');
  
  // GET public announcements
  let result = await makeRequest('GET', '/api/announcements/public');
  logTest('Get Public Announcements', 'GET', '/api/announcements/public', result.status, result.success, result.error);
}

async function testManagement() {
  console.log('\n👥 Testing Management APIs...');
  
  // GET active management team
  let result = await makeRequest('GET', '/api/management/active');
  logTest('Get Active Management Team', 'GET', '/api/management/active', result.status, result.success, result.error);
}

async function testMassBookings() {
  console.log('\n⛪ Testing Mass Booking APIs...');
  
  // GET all mass bookings
  let result = await makeRequest('GET', '/api/mass-bookings');
  logTest('Get All Mass Bookings', 'GET', '/api/mass-bookings', result.status, result.success, result.error);
  
  // POST new mass booking
  const massBookingData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    startDate: '2024-12-25',
    preferredTime: '09:00',
    intentionType: 'thanksgiving',
    intentionDescription: 'Test mass booking for API testing',
    numberOfDays: 1,
    totalAmount: 100
  };
  
  result = await makeRequest('POST', '/api/mass-bookings', massBookingData);
  logTest('Create Mass Booking', 'POST', '/api/mass-bookings', result.status, result.success, result.error);
}

async function testPayments() {
  console.log('\n💳 Testing Payment APIs...');
  
  // GET all payments
  let result = await makeRequest('GET', '/api/payments');
  logTest('Get All Payments', 'GET', '/api/payments', result.status, result.success, result.error);
}

async function testDonations() {
  console.log('\n💰 Testing Donation APIs...');
  
  // GET all donations
  let result = await makeRequest('GET', '/api/donations');
  logTest('Get All Donations', 'GET', '/api/donations', result.status, result.success, result.error);
  
  // GET donation purposes
  result = await makeRequest('GET', '/api/donations/purposes');
  logTest('Get Donation Purposes', 'GET', '/api/donations/purposes', result.status, result.success, result.error);
}

async function testFathers() {
  console.log('\n👨‍💼 Testing Fathers APIs...');
  
  // GET active fathers
  let result = await makeRequest('GET', '/api/fathers/active');
  logTest('Get Active Fathers', 'GET', '/api/fathers/active', result.status, result.success, result.error);
}

async function testAdmin() {
  console.log('\n🔐 Testing Admin APIs...');
  
  // Test admin login
  const loginData = {
    username: 'admin',
    password: 'shrine@admin123'
  };
  
  let result = await makeRequest('POST', '/api/admin/login', loginData);
  logTest('Admin Login', 'POST', '/api/admin/login', result.status, result.success, result.error);
  
  if (result.success && result.data && result.data.token) {
    const token = result.data.token;
    
    // Test protected admin dashboard
    result = await makeRequest('GET', '/api/admin/dashboard', null, { 'Authorization': `Bearer ${token}` });
    logTest('Admin Dashboard', 'GET', '/api/admin/dashboard', result.status, result.success, result.error);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive API Testing (Postman-style)...\n');
  console.log('=' .repeat(60));
  
  try {
    await testServerHealth();
    await testPrayerRequests();
    await testTestimonies();
    await testGallery();
    await testLivestream();
    await testContact();
    await testAnnouncements();
    await testManagement();
    await testMassBookings();
    await testPayments();
    await testDonations();
    await testFathers();
    await testAdmin();
    
  } catch (error) {
    console.error('Error during testing:', error.message);
  }
  
  // Generate test report
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(60));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  // Show failed tests
  const failedTests = testResults.filter(test => !test.success);
  if (failedTests.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    failedTests.forEach(test => {
      console.log(`   • ${test.test} - ${test.method} ${test.endpoint} - ${test.error}`);
    });
  }
  
  // Save detailed report
  const reportData = {
    summary: {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      successRate: ((passedTests / totalTests) * 100).toFixed(1) + '%',
      timestamp: new Date().toISOString()
    },
    results: testResults
  };
  
  fs.writeFileSync('api-test-results.json', JSON.stringify(reportData, null, 2));
  console.log('\n📄 Detailed report saved to: api-test-results.json');
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Your APIs are ready for production deployment.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review and fix the issues before deployment.');
  }
}

// Check server connection
async function checkServerConnection() {
  try {
    const response = await axios.get(BASE_URL, { timeout: 5000 });
    console.log('✅ Server connection established');
    return true;
  } catch (error) {
    console.log('❌ Cannot connect to server at', BASE_URL);
    console.log('Please make sure your backend server is running on port 5000');
    console.log('Run: cd backend && npm start');
    return false;
  }
}

// Start testing
async function main() {
  const serverRunning = await checkServerConnection();
  if (serverRunning) {
    await runAllTests();
  }
}

main();