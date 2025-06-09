class Search {
    constructor(data) {
        this.originalData = data || [];
    }

    search(query, options = {}) {
        const {mode = 'exact', caseSensitive = false } = options;

        switch(mode){
            case 'exact':
                if (caseSensitive) {
                    return this.originalData.filter(item => item === query);
                } else {
                    return this.originalData.filter(item => 
                        typeof item === 'string' && typeof query === 'string'
                        ? item.toLowerCase() === query.toLowerCase()
                        : item === query
                    );
                }
                break;
            default:
                throw new Error('No modes matched with existing ones.');
        }
    }
}


const searchInstance = new Search(['apple', 'banana', 'Banana', 'Apple', 'orange','Orange', 'Orang3']);
const search2 = new Search({name: 'John', age: 20});

console.log(searchInstance.search('banana'));

console.log(searchInstance.search('Apple', {caseSensitive: true}));

/* console.log(searchInstance.search('apple', { mode: 'not-exact'})); */

console.log(searchInstance.search('orange'));

console.log(searchInstance.search('Orang3', { caseSensitive: true }))

console.log(search2.search({age: 20}))

console.log(performance.now())