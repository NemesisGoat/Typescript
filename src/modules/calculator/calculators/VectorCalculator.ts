import { Vector } from "../types";
import AnyType from "../types/AnyType";
import ICalculator from "./ICalculator";

class VectorCalculator implements ICalculator<Vector> {
    calc: ICalculator<AnyType>;
    constructor(calc: ICalculator<AnyType>) {
        this.calc = calc;
    }

    div() {
        return null;
    }

    add(a:Vector, b:Vector): Vector {
        return new Vector(a.values.map((elem, i) => this.calc.add(elem, b.values[i])));
    }

    sub(a:Vector, b:Vector): Vector {
        return new Vector(a.values.map((elem, i) => this.calc.sub(elem, b.values[i])));
    }

    mult(a:Vector, b:Vector): Vector {
        return new Vector([
            this.calc.sub(this.calc.mult(a.values[1], b.values[2]), this.calc.mult(a.values[2], b.values[1])),
            this.calc.sub(this.calc.mult(a.values[2], b.values[0]), this.calc.mult(a.values[0], b.values[2])),
            this.calc.sub(this.calc.mult(a.values[0], b.values[1]), this.calc.mult(a.values[1], b.values[0]))
        ])
    }


    pow(a:Vector, n: number): Vector {
        let c = a;
        for (let i = 1; i < n; i++) {
            c = this.mult(c, a);
        }
        return c;
    }

    prod(a:Vector, p:number): Vector {
        return new Vector(a.values.map(elem => this.calc.prod(elem, p)));
    }

    one(length:number): Vector {
        const values = [];
        for (let i = 0; i < length; i++) {
            values.push(i === 0 ? this.calc.one() : this.calc.zero());
        }
        return new Vector(values);
    }

    zero(length:number): Vector {
        const values = [];
        for (let i = 0; i < length; i++) {
            values.push(this.calc.zero());
        }
        return new Vector(values);
    }
}

export default VectorCalculator;