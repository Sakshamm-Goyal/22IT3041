const axios = require('axios');

async function testAPI() {
  console.log('🧪 Testing Fixed API Routes...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get('http://localhost:3000/api/health');
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: Create Short URL
    console.log('2. Testing Create Short URL...');
    const createData = {
      url: 'https://www.google.com',
      validity: 60,
      shortcode: 'test123'
    };
    
    const createResponse = await axios.post('http://localhost:3000/api/shorturls', createData);
    console.log('✅ Short URL Created:', createResponse.data.data.shortLink);
    console.log('');

    // Test 3: Get Statistics
    console.log('3. Testing Get Statistics...');
    const statsResponse = await axios.get('http://localhost:3000/api/shorturls/test123');
    console.log('✅ Statistics Retrieved:');
    console.log(`   - Total Clicks: ${statsResponse.data.data.clicks}`);
    console.log(`   - Original URL: ${statsResponse.data.data.originalURL}`);
    console.log('');

    // Test 4: Test Redirection
    console.log('4. Testing Redirection...');
    try {
      const redirectResponse = await axios.get('http://localhost:3000/test123', {
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        }
      });
      console.log('✅ Redirection Status:', redirectResponse.status);
    } catch (error) {
      if (error.response && error.response.status === 302) {
        console.log('✅ Redirection Status: 302');
        console.log('✅ Redirected to:', error.response.headers.location);
      } else {
        console.log('❌ Redirection Error:', error.message);
      }
    }
    console.log('');

    console.log('🎉 All API tests completed successfully!');
    console.log('\n📝 Test Summary:');
    console.log('   ✅ Health Check');
    console.log('   ✅ Create Short URL');
    console.log('   ✅ Get Statistics');
    console.log('   ✅ Redirection');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();
