import ICalculator from "./ICalculator";

class RealCalculator implements ICalculator<number> {
    add(a: number, b: number) {
        return a + b;
    }

    sub(a: number, b: number) {
        return a - b;
    }

    mult(a: number, b: number) {
        return a * b;
    }

    div(a: number, b: number) {
        return a / b;
    }

    pow(a: number, n: number) {
        return Math.pow(a, n);
    }

    prod(a: number, p: number) {
        return a * p;
    }

    one() {
        return 1;
    }

    zero() {
        return 0;
    }
};

export default RealCalculator;