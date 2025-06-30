import Seekr from './index.js';
import { performance } from "perf_hooks";

const gc = typeof global.gc === 'function' ? global.gc : undefined;

class PerformanceTester {
    constructor() {
        this.results = {};
        this.warmupRuns = 3;
        this.testRuns = 15; // Increased for better statistical significance
        this.gcWaitTime = 100; // ms to wait after GC
    }

    // Force garbage collection and wait
    async forceGC() {
        if (gc) {
            gc();
            await new Promise(resolve => setTimeout(resolve, this.gcWaitTime));
        }
    }

    // Generate test data
    generateTestData() {
        return {
            // String arrays of different sizes
            smallStringArray: Array(1e3).fill().map((_, i) => i % 2 === 0 ? 'Apple' : 'Banana'),
            mediumStringArray: Array(1e5).fill().map((_, i) => i % 3 === 0 ? 'Apple' : (i % 3 === 1 ? 'Banana' : 'Cherry')),
            largeStringArray: Array(1e6).fill().map((_, i) => i % 4 === 0 ? 'Apple' : (i % 4 === 1 ? 'Banana' : (i % 4 === 2 ? 'Cherry' : 'Date'))),
            
            // Object arrays
            smallObjectArray: Array(1e3).fill().map((_, i) => ({
                id: i,
                name: i % 2 === 0 ? 'John' : 'Jane',
                category: i % 3 === 0 ? 'A' : (i % 3 === 1 ? 'B' : 'C'),
                active: i % 2 === 0
            })),
            mediumObjectArray: Array(1e5).fill().map((_, i) => ({
                id: i,
                name: i % 2 === 0 ? 'John' : 'Jane',
                category: i % 3 === 0 ? 'A' : (i % 3 === 1 ? 'B' : 'C'),
                active: i % 2 === 0,
                email: `user${i}@example.com`
            })),
            largeObjectArray: Array(5e5).fill().map((_, i) => ({ // Reduced size for object tests
                id: i,
                name: i % 2 === 0 ? 'John' : 'Jane',
                category: i % 3 === 0 ? 'A' : (i % 3 === 1 ? 'B' : 'C'),
                active: i % 2 === 0,
                email: `user${i}@example.com`,
                metadata: { score: i % 100, region: i % 5 }
            })),

            // Nested objects
            nestedObjectArray: Array(1e4).fill().map((_, i) => ({
                id: i,
                user: {
                    profile: {
                        name: i % 2 === 0 ? 'John' : 'Jane',
                        settings: {
                            theme: i % 2 === 0 ? 'dark' : 'light'
                        }
                    }
                }
            })),

            // Mixed data types
            mixedArray: Array(1e5).fill().map((_, i) => {
                if (i % 3 === 0) return i;
                if (i % 3 === 1) return i % 2 === 0 ? 'Apple' : 'Banana';
                return { id: i, name: 'Item' + i };
            }),

            // Edge cases
            emptyArray: [],
            singleItem: ['Apple'],
            duplicateValues: Array(1e5).fill('Apple'),
            unicodeStrings: Array(1e4).fill().map((_, i) => `🍎Apple${i}🍌`),
            longStrings: Array(1e3).fill().map((_, i) => 'A'.repeat(1000) + i)
        };
    }

    // Run a single test with precise measurements
    async runSingleTest(testFn, testName) {
        await this.forceGC();
        
        const startMemory = process.memoryUsage();
        const startTime = performance.now();
        
        const result = testFn();
        
        const endTime = performance.now();
        const endMemory = process.memoryUsage();
        
        return {
            name: testName,
            duration: endTime - startTime,
            resultCount: Array.isArray(result) ? result.length : (result ? 1 : 0),
            memoryDelta: {
                heapUsed: endMemory.heapUsed - startMemory.heapUsed,
                heapTotal: endMemory.heapTotal - startMemory.heapTotal,
                external: endMemory.external - startMemory.external
            }
        };
    }

    // Run multiple iterations and calculate statistics
    async runTestSuite(testFn, testName) {
        console.log(`\\n🧪 Running ${testName}...`);
        
        // Warm-up runs
        console.log(`  Warming up (${this.warmupRuns} runs)...`);
        for (let i = 0; i < this.warmupRuns; i++) {
            await this.runSingleTest(testFn, testName);
        }

        // Actual test runs
        console.log(`  Measuring performance (${this.testRuns} runs)...`);
        const results = [];
        
        for (let i = 0; i < this.testRuns; i++) {
            const result = await this.runSingleTest(testFn, testName);
            results.push(result);
            
            // Progress indicator
            if ((i + 1) % 5 === 0) {
                console.log(`    Completed ${i + 1}/${this.testRuns} runs`);
            }
        }

        return this.calculateStatistics(results, testName);
    }

    // Calculate comprehensive statistics
    calculateStatistics(results, testName) {
        const durations = results.map(r => r.duration);
        const resultCounts = results.map(r => r.resultCount);
        
        durations.sort((a, b) => a - b);
        
        const stats = {
            name: testName,
            count: results.length,
            duration: {
                min: Math.min(...durations),
                max: Math.max(...durations),
                mean: durations.reduce((a, b) => a + b, 0) / durations.length,
                median: durations[Math.floor(durations.length / 2)],
                p95: durations[Math.floor(durations.length * 0.95)],
                p99: durations[Math.floor(durations.length * 0.99)],
                stdDev: this.calculateStdDev(durations)
            },
            results: {
                count: resultCounts[0], // Should be consistent
                consistent: resultCounts.every(c => c === resultCounts[0])
            },
            memory: {
                avgHeapDelta: results.reduce((sum, r) => sum + r.memoryDelta.heapUsed, 0) / results.length
            }
        };

        return stats;
    }

    calculateStdDev(values) {
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    }

    // Format and display results
    displayResults(stats) {
        console.log(`\\n📊 Results for ${stats.name}:`);
        console.log(`  ⏱️  Duration (ms):`);
        console.log(`     Min: ${stats.duration.min.toFixed(2)}`);
        console.log(`     Max: ${stats.duration.max.toFixed(2)}`);
        console.log(`     Mean: ${stats.duration.mean.toFixed(2)}`);
        console.log(`     Median: ${stats.duration.median.toFixed(2)}`);
        console.log(`     95th percentile: ${stats.duration.p95.toFixed(2)}`);
        console.log(`     99th percentile: ${stats.duration.p99.toFixed(2)}`);
        console.log(`     Std Dev: ${stats.duration.stdDev.toFixed(2)}`);
        console.log(`  🎯 Results: ${stats.results.count} items found`);
        console.log(`  🧠 Memory: ${(stats.memory.avgHeapDelta / 1024 / 1024).toFixed(2)} MB avg heap change`);
        
        // Performance rating
        const rating = this.getPerformanceRating(stats.duration.mean);
        console.log(`  📈 Rating: ${rating}`);
    }

    getPerformanceRating(meanTime) {
        if (meanTime < 10) return "🚀 Excellent (<10ms)";
        if (meanTime < 50) return "✅ Good (<50ms)";
        if (meanTime < 200) return "⚠️  Acceptable (<200ms)";
        if (meanTime < 500) return "🐌 Slow (<500ms)";
        return "🚨 Very Slow (>500ms)";
    }

    // Run all performance tests
    async runAllTests() {
        console.log('🚀 Starting Comprehensive Performance Tests');
        console.log('============================================');
        
        const testData = this.generateTestData();
        const allResults = [];

        // Test 1: String Array Exact Search (Case Sensitive)
        allResults.push(await this.runTestSuite(() => {
            const searcher = new Seekr(testData.largeStringArray);
            return searcher.search('Apple', null, { mode: 'exact', caseSensitive: true });
        }, 'Large String Array - Exact Search (Case Sensitive)'));

        // Test 2: String Array Exact Search (Case Insensitive)
        allResults.push(await this.runTestSuite(() => {
            const searcher = new Seekr(testData.largeStringArray);
            return searcher.search('apple', null, { mode: 'exact', caseSensitive: false });
        }, 'Large String Array - Exact Search (Case Insensitive)'));

        // Test 3: Object Array Property Search
        allResults.push(await this.runTestSuite(() => {
            const searcher = new Seekr(testData.largeObjectArray);
            return searcher.search('John', 'name', { mode: 'exact', caseSensitive: true });
        }, 'Large Object Array - Property Search'));

        // Test 4: Substring Search
        allResults.push(await this.runTestSuite(() => {
            const searcher = new Seekr(testData.mediumStringArray);
            return searcher.search('App', null, { mode: 'sub-string' });
        }, 'Medium String Array - Substring Search'));

        // Test 5: Mixed Data Type Search
        allResults.push(await this.runTestSuite(() => {
            const searcher = new Seekr(testData.mixedArray);
            return searcher.search('Apple', null, { mode: 'exact' });
        }, 'Mixed Array - Exact Search'));

        // Test 6: Edge Case - Empty Results
        allResults.push(await this.runTestSuite(() => {
            const searcher = new Seekr(testData.largeStringArray);
            return searcher.search('NonExistent', null, { mode: 'exact' });
        }, 'Large Array - No Results Found'));

        // Test 7: Edge Case - All Results Match
        allResults.push(await this.runTestSuite(() => {
            const searcher = new Seekr(testData.duplicateValues);
            return searcher.search('Apple', null, { mode: 'exact' });
        }, 'Duplicate Values - All Match'));

        // Test 8: Unicode Strings
        allResults.push(await this.runTestSuite(() => {
            const searcher = new Seekr(testData.unicodeStrings);
            return searcher.search('🍎Apple1🍌', null, { mode: 'exact' });
        }, 'Unicode Strings - Exact Search'));

        // Test 9: Nested Object Search (if supported)
        allResults.push(await this.runTestSuite(() => {
            const searcher = new Seekr(testData.nestedObjectArray);
            return searcher.search('John', 'user.profile.name', { mode: 'exact' });
        }, 'Nested Object - Deep Property Search'));

        // Display all results
        console.log('\\n\\n📈 COMPREHENSIVE TEST SUMMARY');
        console.log('===============================');
        
        allResults.forEach(stats => this.displayResults(stats));

        // Overall performance summary
        const overallMean = allResults.reduce((sum, stat) => sum + stat.duration.mean, 0) / allResults.length;
        console.log(`\\n🎯 Overall Average Performance: ${overallMean.toFixed(2)}ms`);
        
        // Identify fastest and slowest tests
        const fastest = allResults.reduce((min, stat) => stat.duration.mean < min.duration.mean ? stat : min);
        const slowest = allResults.reduce((max, stat) => stat.duration.mean > max.duration.mean ? stat : max);
        
        console.log(`🚀 Fastest Test: ${fastest.name} (${fastest.duration.mean.toFixed(2)}ms)`);
        console.log(`🐌 Slowest Test: ${slowest.name} (${slowest.duration.mean.toFixed(2)}ms)`);

        return allResults;
    }
}

// Run the comprehensive test suite
async function main() {
    const tester = new PerformanceTester();
    
    try {
        await tester.runAllTests();
        console.log('\\n✅ All performance tests completed successfully!');
    } catch (error) {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    }
}

// Check if running directly
/* if (import.meta.url === `file://${process.argv[1]}`) {
    main();
} */

main();

export { PerformanceTester };