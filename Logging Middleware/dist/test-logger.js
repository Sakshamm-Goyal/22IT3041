"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testLogger = testLogger;
const logger_1 = require("./logger");
async function testLogger() {
    console.log('🧪 Testing Logging Middleware...\n');
    try {
        // Test different log levels
        console.log('1. Testing Debug Level...');
        await logger_1.logger.debug('utils', 'Debug message for testing');
        console.log('2. Testing Info Level...');
        await logger_1.logger.info('service', 'Service started successfully');
        console.log('3. Testing Warn Level...');
        await logger_1.logger.warn('middleware', 'Rate limit approaching');
        console.log('4. Testing Error Level...');
        await logger_1.logger.error('db', 'Database connection timeout');
        console.log('5. Testing Fatal Level...');
        await logger_1.logger.fatal('service', 'Critical system failure');
        console.log('6. Testing Invalid Parameters...');
        // This should be handled gracefully
        await logger_1.logger.log('invalid', 'info', 'service', 'Test message');
        console.log('\n✅ All logging tests completed!');
        console.log('\n📋 Test Summary:');
        console.log('   ✅ Debug logging');
        console.log('   ✅ Info logging');
        console.log('   ✅ Warn logging');
        console.log('   ✅ Error logging');
        console.log('   ✅ Fatal logging');
        console.log('   ✅ Invalid parameter handling');
    }
    catch (error) {
        console.error('❌ Logger test failed:', error.message);
    }
}
// Run tests if this file is executed directly
if (require.main === module) {
    testLogger();
}
//# sourceMappingURL=test-logger.js.map