import Search from "./index.js";
import { performance } from "perf_hooks";

function stresTest() {
    const bigData = Array(1e6).fill().map((_, i) => i % 2 === 0 ? 'Apple' : 'Banana');
    const t1 = performance.now();

    const bigSearch = new Search(bigData);

    bigSearch.search('Banana', { caseSensitive: true }).length;

    const t2 = performance.now();

    return (t2 - t1);
}

let performanceCollector = [];
let sum = 0;

for (let i = 0; i <= 10; i++) {
    performanceCollector.push(stresTest());
}

function averageTime () {
    performanceCollector.forEach(time => sum += time);
    return (sum / 10).toFixed(2);
}

console.log('Average Time of Stress Test:', averageTime() + 'ms');