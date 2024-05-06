import { useRef } from 'react';
import Calculator from "../../modules/calculator/Calculator";

const Calc = (props) => {

    let bRef = useRef(0);
    let cRef = useRef(0);
    let aRef = useRef(0);

    const operandHandler = (operand) => {
        const calc = new Calculator();
        const a = calc.getValue(aRef.current.value);
        const b = calc.getValue(bRef.current.value);
        const result = calc[operand](a, b);
        cRef.current.value = result.toString();
        if (cRef.current.value.includes('NaN')) {
            cRef.current.value = 'Да я не могу блин';
        }
    }

    const getValueHandler = () => {
        const calc = new Calculator;
        let x = document.getElementById('point').value;
        let polynomial = document.getElementById('c').value;
        document.getElementById('value').value = calc.getValueAtPoint(polynomial, x);
    }

    const addEventListeners = () => {

        const buttons = document.querySelectorAll('.operand');
        buttons.forEach(button =>
            button.addEventListener(
                'click',
                (event) => this.operandHandler(event)
            )
        );
        document.getElementById('getValueButton')
            .addEventListener(
                'click',
                () => this.getValueHandler());

    }

    return (<div>
        <div className="titleBlock">
            <h1 className="title" id="partOne">Calcu</h1>
            <h1 className="title" id="partTwo">lator</h1>
        </div>
        <div className="inputBlock">
            <textarea ref={aRef} placeholder="a" className="input"></textarea>
            <textarea ref={bRef} placeholder="b" className="input"></textarea>
            <textarea ref={cRef} placeholder="result" className="input"></textarea>
            <div className='operandBlock'>
                <button className="operand" onClick={() => operandHandler("add")}>+</button>
                <button className="operand" onClick={() => operandHandler("sub")}>-</button>
                <button className="operand" onClick={() => operandHandler("mult")}>*</button>
                <button className="operand" onClick={() => operandHandler("div")}>/</button>
                <button className="operand" onClick={() => operandHandler("prod")}>scal</button>
                <button className="operand" onClick={() => operandHandler("pow")}>^</button>
            </div>
            <input id="point" placeholder="Найти значение в точке" className="input"></input>
            <button id='getValueButton' className="findButton">Искать</button>
            <div></div>
            <input id="value" placeholder="Значение" className="input"></input>
            <div className="operands">
            </div>
        </div>
    </div>)
}

export default Calc;