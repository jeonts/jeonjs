import { readdirSync } from 'fs'
import { join } from 'path'
import { pathToFileURL } from 'url'

// Simple test runner that imports and runs test files directly
async function runAllTests() {
    console.log('🚀 Starting all tests...\n')

    // Get all test files from the test directory
    const testDir = join(process.cwd(), 'src', 'test')
    const files = readdirSync(testDir)
        .filter(file => file.endsWith('.test.ts') && !file.includes('chk')) // Skip chk test files
        .sort()

    console.log(`Found ${files.length} test files\n`)

    let passedTests = 0
    let failedTests = 0
    const failedTestNames: string[] = []

    // Run each test file
    for (const file of files) {
        try {
            console.log(`\n🧪 Running test: ${file}`)
            console.log('='.repeat(50))

            // Dynamically import the test file using the correct path
            const fullPath = join(testDir, file)
            const moduleUrl = pathToFileURL(fullPath).href
            const testModule = await import(moduleUrl)

            // If the module has a default export that's a function, execute it
            if (testModule.default && typeof testModule.default === 'function') {
                await testModule.default()
            }

            console.log(`✅ Test ${file} completed successfully\n`)
            passedTests++
        } catch (error: unknown) {
            // Check if it's a browser-specific error
            const errorMessage = (error as Error).toString()
            if (errorMessage.includes('document is not defined') ||
                errorMessage.includes('window is not defined') ||
                errorMessage.includes('navigator is not defined')) {
                console.log(`🌐 Test ${file} skipped (browser-specific API)\n`)
                failedTests++
                failedTestNames.push(`${file} (browser-specific)`)
            } else {
                console.log(`❌ Test ${file} failed\n`)
                failedTests++
                failedTestNames.push(file)
                // Only show error for non-browser specific issues
                if (!(error as Error).toString().includes('document is not defined')) {
                    console.error(error)
                }
            }
        }
    }

    console.log('\n' + '='.repeat(50))
    console.log(`📊 Test Results:`)
    console.log(`✅ Passed: ${passedTests}`)
    console.log(`❌ Failed: ${failedTests}`)
    console.log(`Total: ${passedTests + failedTests}`)

    if (failedTestNames.length > 0) {
        console.log('\nFailed tests:')
        failedTestNames.forEach(name => console.log(`  - ${name}`))
    }

    console.log('\n🏁 All tests completed!')
}

// Run the tests
runAllTests().catch(console.error)