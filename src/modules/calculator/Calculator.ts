import { Complex, Vector, Matrix, Polynomial, Member } from "./types";
import {
    RealCalculator,
    ComplexCalculator,
    VectorCalculator,
    MatrixCalculator
} from "./calculators";
import ICalculator, { EOperand } from "./calculators/ICalculator";
import AnyType from "./types/AnyType";
import PolynomialCalculator from "./PolynomialCalculator";

class Calculator implements ICalculator<AnyType> {

    complex(re?: number, im?: number): Complex {
        return new Complex(re, im);
    }

    vector(values?: AnyType[]): Vector {
        return new Vector(values);
    }

    matrix(values?: AnyType[][]): Matrix {
        return new Matrix(values);
    }

    // getPolynomial(str:string): Polynomial {
    //     const poly = [];
    //     if (str && typeof str === 'string') {
    //         str = str.replaceAll('-', '+-');
    //         if (str[0] === '+') {
    //             str = str.replace('+', '')
    //         }
    //         str = str.replaceAll(' ', '');
    //         const members = str.split('+');
    //         members.forEach((member, index) => {
    //             if (!(member[member.indexOf('x') - 1] === '*')) {
    //                 member = member.replace('x', '1*x');
    //                 members[index] = member;
    //             }
    //             if (!(member[member.indexOf('x') + 1] === '^')) {
    //                 member = member.replace('x', 'x^1');
    //                 members[index] = member;
    //             }
    //             if (!(member.includes('x'))) {
    //                 member = member + '*x^0';
    //                 members[index] = member;
    //             }
    //             poly.push(new Member(member.split('*x^')[0] - 0, member.split('*x^')[1] - 0))
    //         })
    //     }
    //     return new Polynomial(poly);
    // }

    // getValueAtPoint(polynomial, x) {
    //     polynomial = polynomial.replaceAll('^', '**').replaceAll('x', x)
    //     return eval(polynomial);
    // }


    getMatrix(str: string): Matrix {
        if (str instanceof Array) return new Matrix(str);
        if (str && typeof str === 'string') {
            str = str.replaceAll(' ', '');
            str = str.replaceAll(',', ' ');
            str = str.replaceAll(' \n', '\n');
            const arr = str.split('\n');
            const values = [];
            for (let i = 0; i < arr.length; i++) {
                values.push(arr[i].split(' ').map(el => this.getValue(el)));
            }
            if (values[0] instanceof Array) {
                return new Matrix(values);
            }
        }
        return null;
    }

    getVector(str: string): Vector {
        if (str instanceof Array) return new Vector(str);
        if (str && typeof str === 'string') {
            const arr = str.replace('(', '').replace(')', '').split(' ').map(el => this.getValue(el));
            return new Vector(arr);
        }
        return null;
    }

    getComplex(str: string): Complex {
        if (typeof str === 'number') return new Complex(str);
        if (str && typeof str === 'string') {

            if (str[str.indexOf('i') + 1] !== '*') {
                str = str.replace('i', 'i*1');
            }

            const arrStr = str.split('i*');
            if (arrStr.length === 2) {
                if (arrStr[0].includes('+')) {
                    arrStr[0] = arrStr[0].replace('+', '');
                    return new Complex(Number(arrStr[0]), Number(arrStr[1]));
                }
                if (arrStr[0].includes('-')) {
                    arrStr[0] = arrStr[0].replace('-', '');
                    return new Complex(Number(arrStr[0]), -Number(arrStr[1]));
                }
            }
            if (arrStr.length === 1) {
                if (isNaN(Number(arrStr[0]))) return null;
                return new Complex(Number(arrStr[0]));
            }
            return new Complex(Number(arrStr[0]), Number(arrStr[1]));
        }
        return null;
    }

    getValue(str) {
        if (str.includes('\n')) return this.getMatrix(str);
        if (str.includes('(')) return this.getVector(str);
        if (str.includes('x')) return this.getPolynomial(str);
        if (str.includes('i')) return this.getComplex(str);
        return str - 0;
    }

    get(elem?: AnyType): ICalculator<AnyType> {
        if (elem instanceof Polynomial) {
            return new PolynomialCalculator((elem));
        }
        if (elem instanceof Matrix) {
            return new MatrixCalculator(this.get(elem.values[0][0]));
        }
        if (elem instanceof Vector) {
            return new VectorCalculator(this.get(elem.values[1]));
        }
        if (elem instanceof Complex) {
            return new ComplexCalculator();
        }
        return new RealCalculator();
    }

    [EOperand.add](a: AnyType, b: AnyType): AnyType {
        return this.get(a).add(a, b);
    }

    [EOperand.sub](a: AnyType, b: AnyType): AnyType {
        return this.get(a).sub(a, b);
    }

    [EOperand.mult](a: AnyType, b: AnyType): AnyType {
        return this.get(a).mult(a, b);
    }

    [EOperand.div](a: AnyType, b: AnyType): AnyType {
        return this.get(a).div(a, b);
    }

    [EOperand.pow](a: AnyType, n: number): AnyType {
        if (typeof n === 'number') {
            return this.get(a).pow(a, n);
        }
        return null;
    }

    prod(a: AnyType, p: number): AnyType {
        if (typeof p === 'number') {
            return this.get(a).prod(a, p);
        }
        return null;
    }

    one(type: string, elem: AnyType): AnyType {
        type = type ? type : elem ? elem.constructor.name : null;
        switch (type) {
            case 'Complex': return this.get(this.complex()).one();
            case 'Vector': return this.get(elem).one(elem.values.length);
            case 'Matrix': return this.get(elem).one(elem.values.length);
            default: return this.get().one();
        }
    }

    zero(type:string, elem:AnyType): AnyType {
        type = type ? type : elem ? elem.constructor.name : null;
        switch (type) {
            case 'Complex': return this.get(this.complex()).zero();
            case 'Vector': return this.get(elem).zero(elem.values.length);
            case 'Matrix': return this.get(elem).zero(elem.values.length);
            default: return this.get().zero();
        }
    }
}

export default Calculator;