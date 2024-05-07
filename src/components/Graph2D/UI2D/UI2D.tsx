import React, { useState } from "react"
import { TFunc } from "./Func/Func"
import { TFunction } from "../Graph2D"
import useMyFunction from "./hooks/useMyFunction"


type TUI2D = {
    funcs: TFunction[];
}

const UI2D: React.FC<TUI2D> = (props: TUI2D) => {
    const { funcs } = props;
    const [count, setCount] = useState<number>(funcs.length);

    const addFunction = () => {
        funcs.push({
            f: getFunction(0),
            color: 'black',
            width: 2,
            a: 1,
            b: 3
        });
        setCount(funcs.length);
    }

    const delFunction = (index: number): void => {
        funcs.splice(index, 1);
        setCount(funcs.length);
    }

    return (<div>
    <div id="funcInput">
            <input type="checkbox" id="setInterpolation"></input>
            <label htmlFor="setInterpolation">Интеполяция</label>
            <div id="listOfFunctions"></div>
            <button id="addFunction">+</button>
        </div>
        <canvas id="canvas"></canvas>
    </div>)
}

export default UI2D