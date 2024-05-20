import AnyType from "./AnyType";

class Matrix {
    values: AnyType[][];
    constructor(value: AnyType[][] = [[]]) {
        this.values = [];
        value.forEach((arr, i) => {
            this.values[i] = [];
            arr.forEach(el => this.values[i].push(el))
        });
    }

    /*
    1, 2, 3
    4, 5, 6
    7, 8, 9 
    */

    toString(): string {
        return this.values.map(
            arr => arr.map(el => el.toString()).join(', ')
        ).join('\n');
    }
}

export default Matrix;