class Seekr {
    constructor(data) {
        this.originalData = data;
    }

    search(query, property, options = {}) {
        const {mode = 'exact', caseSensitive = false } = options;

        switch(mode){
            case 'exact':
                // search by property
                if (property) {
                    return this.originalData.filter(item => {
                        if (caseSensitive) {
                            return item[property] === query;
                        } else {
                            return typeof item[property] === 'string' && typeof query === 'string'
                                ? item[property].toLowerCase() === query.toLowerCase()
                                : item[property] === query;
                        }
                    })
                } else {
                    // search by direct values
                    return this.originalData.filter(item => {
                        if (caseSensitive) {
                            return item === query;
                        } else {
                            return typeof item === 'string' && typeof query === 'string'
                                ? item.toLowerCase() === query.toLowerCase()
                                : item === query;
                        }
                    })
                }
                break;
            case 'sub-string':
                for (let i = 0; i < this.originalData.length; i++) {
                    if (typeof this.originalData[i] !== 'string') {
                        throw new Error('In the SubString Mode Only String Data Type is allowed.')
                    }
                }
                return this.originalData.filter(item => item.includes(query));
            default:
                throw new Error('No modes matched with existing ones.');
        }
    }
}

export default Seekr;

/* import { performance } from "perf_hooks";

const t1 = performance.now();

const objectSearch = [{id: 1, name: 'john'}, {id: 2, name: 'jessica'}]
const arraySearch = ['Apple', 'apple', 'banana', 'Banana'];
const subStringSearch = ['hi, how are you?'];

console.log( new Seekr(objectSearch).search('john', 'name', { mode: 'exact'}));
console.log( new Seekr(objectSearch).search('jessica', 'name', { mode: 'exact', caseSensitive: true}));
console.log( new Seekr(arraySearch).search('Apple', null, { mode: 'exact', caseSensitive: true}));
console.log( new Seekr(arraySearch).search('Banana', null, { mode: 'exact'}));
console.log( new Seekr(subStringSearch).search('hi', null, { mode: 'sub-string'}));

const t2 = performance.now();
const time = (t2 - t1).toFixed(2);
console.log(time + 'ms') */