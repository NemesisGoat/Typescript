import React, {KeyboardEvent} from "react";
import { TFunction } from "../../Graph2D";
import useMyFunction from "../hooks/useMyFunction";

export type TFunc = {
    func: TFunction;
}

const Func: React.FC<TFunc> = (props: TFunc) => {
    const { func } = props;

    const changeFunction = (event: KeyboardEvent<HTMLInputElement>) => {
        func.f = getFunction(event.currentTarget.value);
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