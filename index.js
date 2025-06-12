class Search {
    constructor(data) {
        this.originalData = Array.isArray(data) ? data : (data ? [data] : []);
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
            case 'sub-string':
                for (let i = 0; i < this.originalData.length; i++) {
                    if (typeof this.originalData[i] !== 'string') {
                        throw new Error('In the SubString Mode Only String Data Type is allowed.')
                    }
                    return this.originalData.filter(item => item.includes(query));
                }
            default:
                throw new Error('No modes matched with existing ones.');
        }
    }
}

export default Search;

console.log(new Search('Hi, How are you?').search('Hi', { mode: 'sub-string'}));