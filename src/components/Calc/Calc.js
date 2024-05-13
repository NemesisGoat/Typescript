import React from "react";

import Calculator from "../../modules/Calculator/Calculator";
import PolynomialCalculator from "../../modules/Calculator/PolynomialCalculator";

class Calc extends React.Component {
    constructor(props) {
        super(props);

        this.aRef = React.createRef();
        this.bRef = React.createRef();
    }

    getCalculator(value) {
        if (value.includes('*x^')) {
            return new PolynomialCalculator;
        }
        return new Calculator;
    }

    operandHandler(operand) {
        const aValue = this.aRef.current.value;
        const bValue = this.bRef.current.value;
        const calc = this.getCalculator(aValue);
        const a = calc.getValue(aValue);
        const b = operand === 'prod' ?
            (new Calculator()).getValue(bValue) :
            calc.getValue(bValue);
        const result = calc[operand](a, b);
        if (result === null) {
            document.getElementById('c').value = 'чё-то не так, товарищ... :(';
        } else {
            document.getElementById('c').value = result.toString();
        }
    }

    polyAtAPointHandler() {
        const universalCalc = new Calculator;
        const calc = new PolynomialCalculator;
        const poly = calc.getPolynomial(document.getElementById('poly').value);
        const x = universalCalc.getValue(document.getElementById('x').value);
        const polyAtAPoint = poly.getValue(x);
        document.getElementById('polyAtAPoint').value = polyAtAPoint;
    }

    render() {
        return (<>
            <div align="center" className="beautyDiv">
                <p className="beautyP">калькулятор (универсальный!!!)</p>
            </div>
            <div align="center" className="beautyDiv">
                <textarea ref={this.aRef} placeholder="введите нечто первое"></textarea>
                <div>
                    <button onClick={() => this.operandHandler("add")}>+</button>
                    <button onClick={() => this.operandHandler("sub")}>-</button>
                    <button onClick={() => this.operandHandler('mult')}>*</button>
                    <button onClick={() => this.operandHandler("div")}>/</button>
                    <button onClick={() => this.operandHandler("pow")}>^</button>
                    <button onClick={() => this.operandHandler('prod')}>prod</button>
                    <button onClick={() => this.operandHandler('one')}>1</button>
                    <button onClick={() => this.operandHandler('zero')}>0</button>
                </div>
                <textarea ref={this.bRef} placeholder="введите нечто второе"></textarea>
                <div>
                    <p> = </p>
                    <textarea id="c" placeholder="результат (дай бог правильный)"></textarea>
                </div>
            </div>
            <div align="center" className="beautyDiv">
                <p className="beautyP">↓ посчитать значение полинома в точке ↓</p>
            </div>
            <div align="center" className="beautyDiv">
                <textarea id="poly" placeholder="введите полином"></textarea>
                <textarea id="x" placeholder="введите икс"></textarea>
                <div>
                    <button onClick={() => this.polyAtAPointHandler()}> = </button>
                </div>
                <div>
                    <textarea id="polyAtAPoint" placeholder="результат"></textarea>
                </div>
            </div>
        </>);
    }
}

export default Calc;