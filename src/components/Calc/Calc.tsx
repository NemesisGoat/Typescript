import React, { useRef } from "react";
import useCalculator from "../../modules/Calculator/hooks/useCalculator";
import { EOperand } from "../../modules/Calculator/calculators/ICalculator";
import './Calc.css';

const Calc: React.FC = () => {

    const refA = useRef<HTMLTextAreaElement>(null);
    const refB = useRef<HTMLTextAreaElement>(null);
    const refC = useRef<HTMLTextAreaElement>(null);
    const calc = useCalculator(refA, refB, refC);

    return (<>
        <div className="titleBlock">
            <h1 className="title" id="partOne">Calcu</h1>
            <h1 className="title" id="partTwo">lator</h1>
        </div>
        <div className="inputBlock">
            <textarea ref={refA} placeholder="a" className="input"></textarea>
            <textarea ref={refB} placeholder="b" className="input"></textarea>
            <textarea ref={refC} placeholder="result" className="input"></textarea>
            <div className='operandBlock'>
                <button className="operand" onClick={() => calc(EOperand.add)}>+</button>
                <button className="operand" onClick={() => calc(EOperand.sub)}>-</button>
                <button className="operand" onClick={() => calc(EOperand.mult)}>*</button>
                <button className="operand" onClick={() => calc(EOperand.div)}>/</button>
                <button className="operand" onClick={() => calc(EOperand.prod)}>scal</button>
                <button className="operand" onClick={() => calc(EOperand.pow)}>^</button>
            </div>
            <input id="point" placeholder="Найти значение в точке" className="input"></input>
            <button id='getValueButton' className="findButton">Искать</button>
            <div></div>
            <input id="value" placeholder="Значение" className="input"></input>
            <div className="operands">
            </div>
        </div>
    </>);
}

export default Calc