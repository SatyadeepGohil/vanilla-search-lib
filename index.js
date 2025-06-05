class Search {
    constructor(data) {
        this.searchData = data || [] || {};
        this.originalData = this.searchData;
    }

    search(query, options = {}) {
        const {mode = 'exact', caseSensitive = false, normalzie = false } = options;
        
        if (mode !== 'exact') {
            throw new Error('Only exact mode is implement for now')
        }
        
        switch(mode){
            case 'exact':

                if (!caseSensitive) {
                    query = query.toLowerCase();
                    return this.searchData.filter(item => item.toLowerCase() === query);
                } else {
                    return this.searchData.filter(item => item === query);
                }
        }
    }

    normalzie(query) {

    }
}


const searchInstance = new Search(['apple', 'banana', 'Apple', 'orange', 'orang3']);

console.log(searchInstance.search('banana', { caseSensitive: true }));

console.log(searchInstance.search('apple', { mode: 'not-exact'}));

console.log(searchInstance.search('orange'));