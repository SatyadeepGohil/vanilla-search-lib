import Search from "./index.js";
import { performance } from "perf_hooks";

const gc = typeof global.gc === 'function' ? global.gc : undefined;

function stresTest() {
    const bigData = Array(1e6).fill().map((_, i) => i % 2 === 0 ? 'Apple' : 'Banana');

    // forced garbage collection for precise measurments
    if (gc) {
        gc();
    }

    const t1 = performance.now();

    const bigSearch = new Search(bigData);

    bigSearch.search('Banana', { caseSensitive: true }).length;

    const t2 = performance.now();

    return (t2 - t1);
}

console.log('Performing warm-up run...');
stresTest();

console.log('Starting stress tests...')
let performanceCollector = [];
let sum = 0;

for (let i = 0; i <= 10; i++) {
    performanceCollector.push(stresTest());
}

function averageTime () {
    performanceCollector.forEach(time => sum += time);
    return (sum / performanceCollector.length).toFixed(2);
}

console.log('Performance measurments complete');
console.log('Individual times (ms):', performanceCollector.map(t => t.toFixed(2)));
console.log('Average Time of Stress Test:', averageTime() + 'ms');