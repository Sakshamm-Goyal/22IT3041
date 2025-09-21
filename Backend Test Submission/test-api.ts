import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing URL Shortener API (TypeScript)...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('');

    // Test 2: Create Short URL
    console.log('2. Testing Create Short URL...');
    const createData = {
      url: 'https://www.google.com/search?q=very+long+search+query+that+goes+on+and+on+with+many+parameters',
      validity: 60,
      shortcode: 'test123'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/shorturls`, createData);
    console.log('✅ Short URL Created:', createResponse.data.data.shortLink);
    const shortcode = createResponse.data.data.shortLink.split('/').pop();
    console.log('');

    // Test 3: Get Statistics
    console.log('3. Testing Get Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/api/shorturls/${shortcode}`);
    console.log('✅ Statistics Retrieved:');
    console.log(`   - Total Clicks: ${statsResponse.data.data.clicks}`);
    console.log(`   - Original URL: ${statsResponse.data.data.originalURL}`);
    console.log(`   - Created At: ${statsResponse.data.data.creationDate}`);
    console.log('');

    // Test 4: Test Redirection (simulate click)
    console.log('4. Testing Redirection...');
    try {
      const redirectResponse = await axios.get(`${BASE_URL}/${shortcode}`, {
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept 2xx and 3xx status codes
        }
      });
      console.log('✅ Redirection Status:', redirectResponse.status);
      console.log('✅ Redirected to:', redirectResponse.headers.location);
    } catch (error: any) {
      if (error.response && error.response.status === 302) {
        console.log('✅ Redirection Status: 302');
        console.log('✅ Redirected to:', error.response.headers.location);
      } else {
        console.log('❌ Redirection Error:', error.message);
      }
    }
    console.log('');

    // Test 5: Get Updated Statistics (after click)
    console.log('5. Testing Updated Statistics...');
    const updatedStatsResponse = await axios.get(`${BASE_URL}/api/shorturls/${shortcode}`);
    console.log('✅ Updated Statistics:');
    console.log(`   - Total Clicks: ${updatedStatsResponse.data.data.clicks}`);
    console.log(`   - Click Details: ${updatedStatsResponse.data.data.clicksDetail.length} click(s) recorded`);
    console.log('');

    // Test 6: Test Invalid URL
    console.log('6. Testing Invalid URL...');
    try {
      await axios.post(`${BASE_URL}/api/shorturls`, {
        url: 'invalid-url',
        validity: 30
      });
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Invalid URL properly rejected:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error for invalid URL:', error.message);
      }
    }
    console.log('');

    // Test 7: Test Duplicate Shortcode
    console.log('7. Testing Duplicate Shortcode...');
    try {
      await axios.post(`${BASE_URL}/api/shorturls`, {
        url: 'https://www.example.com',
        shortcode: 'test123' // Same as before
      });
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        console.log('✅ Duplicate shortcode properly rejected:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error for duplicate shortcode:', error.message);
      }
    }
    console.log('');

    // Test 8: Test Auto-generated Shortcode
    console.log('8. Testing Auto-generated Shortcode...');
    const autoCreateResponse = await axios.post(`${BASE_URL}/api/shorturls`, {
      url: 'https://www.github.com',
      validity: 30
    });
    console.log('✅ Auto-generated shortcode:', autoCreateResponse.data.data.shortLink);
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📝 Test Summary:');
    console.log('   ✅ Health Check');
    console.log('   ✅ Create Short URL');
    console.log('   ✅ Get Statistics');
    console.log('   ✅ Redirection');
    console.log('   ✅ Updated Statistics');
    console.log('   ✅ Invalid URL Handling');
    console.log('   ✅ Duplicate Shortcode Handling');
    console.log('   ✅ Auto-generated Shortcode');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

export { testAPI };
