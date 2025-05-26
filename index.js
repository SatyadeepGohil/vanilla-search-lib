class Search {
    constructor(data) {
        this.data = data || [];
    }

    search(query, options = {}) {
        const {mode = 'exact', caseSensitive = false } = options;

        if (mode != 'exact') {
            throw new Error('Only exact mode is implement for now');
        }

        if (!caseSensitive) {
            query = query.toLowerCase();
            return this.data.filter(item => item.toLowerCase() === query);
        } else {
            return this.data.filter(item => item === query);
        }
    }
}


const searchInstace = new Search(['apple', 'banana', 'Apple', 'orange']);

console.log(searchInstace.search('apple', { caseSensitive: true }));

console.log(searchInstace.search('Apple'));