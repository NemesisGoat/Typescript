import { Member, Polynomial } from "./types";
import Calculator from "./Calculator";

class PolynomialCalculator {
    polynomial(members = []) {
        return new Polynomial(members);
    }

    nothing(members){
        for (let i = members.length - 1; i >= 0; i--) {
            if (members[i].value === 0) {
                return members.slice(0, i);
            }
        }
    }

    getValue(str) {
        return this.getPolynomial(str);
    }

    getMember(str) {
        if (typeof str === 'number') {
            return new Member(str);
        }
        if (str && typeof str === 'string') {
            const arrStr = str.split('*x^');
            return new Member(arrStr[0] - 0, arrStr[1] - 0);
        }
    }

    getPolynomial(str) {
        if (str instanceof Array) {
            return new Polynomial(str);
        }
        if (str && typeof str === 'string' ) {
            const members = [];
            const arrStr = str.replace(/\s+/g, '').replace(/-/g, ' -').split(/[+ ]/g);
            for (let i = 0; i < arrStr.length; i++) {
                members.push(this.getMember(arrStr[i]));
            }
            return new Polynomial(members);
        }
    }

    add(a, b) {
        const calc = new Calculator;
        const members = [];
        a.poly.forEach(elemA => {
            const member = b.poly.find(elemB => elemB.power === elemA.power);
            if (member) {
                members.push(new Member(calc.add(elemA.value, member.value), elemA.power))
            }
            else {
                members.push(new Member(elemA.value, elemA.power))
            }
        });
        b.poly.forEach(elemB => {
            if (!members.find(elem => elem.power === elemB.power)) {
                members.push(new Member(elemB.value, elemB.power));
                }
            });
            this.nothing(members);
            return new Polynomial(members);
    }

    sub(a, b) {
        const calc = new Calculator;
        const members = [];
        a.poly.forEach(elemA => {
            const member = b.poly.find(elemB => elemB.power == elemA.power);
            if (member) {
                members.push(new Member(calc.sub(elemA.value, member.value), elemA.power));
            } else {
                members.push(new Member(elemA.value, elemA.power));
            }
        });
        b.poly.forEach(elemB => {
            if (!members.find(el => el.power == elemB.power)) {
                members.push(new Member(calc.prod(elemB.value, -1), elemB.power));
            }
        });
        this.nothing(members);
        return new Polynomial(members);
    }

    mult(a, b) {
        const calc = new Calculator;
        let polynomial = new Polynomial;
        a.poly.forEach(elemA => {
            const members = [];
            b.poly.forEach(elemB => {
                members.push(new Member(calc.mult(elemA.value, elemB.value), calc.add(elemA.power, elemB.power)));
            });
            this.nothing(members);
            polynomial = this.add(polynomial, new Polynomial(members));
        });
        return polynomial;
    }

    prod(a, p) {
        if (p === 0) {
            return this.zero();
        }
        const calc = new Calculator;
        const members = [];
        a.poly.forEach(elemA => {
            members.push(new Member(calc.prod(elemA.value, p), elemA.power));
        });
        this.nothing(members);
        return new Polynomial(members);
    }

    //0*x^0
    zero() {
        return new Polynomial([new Member]);
    }

    //1*x^0
    one() {
        return new Polynomial([new Member(1)]);
    }
} 

export default PolynomialCalculator;