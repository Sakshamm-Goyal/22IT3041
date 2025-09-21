import { logger } from './logger';

async function testLogger() {
  console.log('🧪 Testing Logging Middleware...\n');

  try {
    // Test different log levels
    console.log('1. Testing Debug Level...');
    await logger.debug('utils', 'Debug message for testing');

    console.log('2. Testing Info Level...');
    await logger.info('service', 'Service started successfully');

    console.log('3. Testing Warn Level...');
    await logger.warn('middleware', 'Rate limit approaching');

    console.log('4. Testing Error Level...');
    await logger.error('db', 'Database connection timeout');

    console.log('5. Testing Fatal Level...');
    await logger.fatal('service', 'Critical system failure');

    console.log('6. Testing Invalid Parameters...');
    // This should be handled gracefully
    await logger.log('invalid' as any, 'info', 'service', 'Test message');

    console.log('\n✅ All logging tests completed!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Debug logging');
    console.log('   ✅ Info logging');
    console.log('   ✅ Warn logging');
    console.log('   ✅ Error logging');
    console.log('   ✅ Fatal logging');
    console.log('   ✅ Invalid parameter handling');

  } catch (error) {
    console.error('❌ Logger test failed:', (error as Error).message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testLogger();
}

export { testLogger };
