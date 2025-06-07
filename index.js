class Search {
    constructor(data) {
        this.originalData = data || [];
        this.searchData = [...this.originalData];
    }

    search(query, options = {}) {
        const {mode = 'exact', caseSensitive = false, isNormalize = false} = options;
        let searchQueryNormalize;

        if (caseSensitive && isNormalize) {
            throw new Error("caseSensitive and isNormalize can't be used at once. it gives incorrect search result, So it's prohibited to use.")
        }

        if (isNormalize) {
            searchQueryNormalize = this.normalize(query);
        }
        switch(mode){
            case 'exact':

                if (caseSensitive) {
                    return this.searchData.filter(item => item === query);
                }
                
                if (isNormalize){
                    return this.searchData.filter(item => item.toLowerCase() === searchQueryNormalize);
                }

                if (!caseSensitive && !isNormalize) {
                    return this.searchData.filter(item => item === query)
                }
                
                break;
            default:
                throw new Error('No modes matched with existing ones.');
        }

    }

    normalize(query) {

            if (typeof query === 'string') {
                query = query.toLowerCase();
                for (let i = 0; i < this.searchData.length; i++) {
                    this.searchData[i] = this.searchData[i].toLowerCase();
                }
                this.resetData();
                return query;
            } else {
                throw new Error('Not a string.')
            }
    }

    resetData () {
        this.searchData = [...this.originalData];
    }
}


const searchInstance = new Search(['apple', 'banana', 'Banana', 'Apple', 'orange', 'orang3']);

console.log(searchInstance.search('banana', { caseSensitive: true }));

console.log(searchInstance.search('Apple', {caseSensitive: true}));

console.log(searchInstance.search('Apple', { isNormalize: true}));

console.log(searchInstance.search('Banana', { isNormalize: true }));

/* console.log(searchInstance.search('apple', { mode: 'not-exact'})); */

console.log(searchInstance.search('orange'));