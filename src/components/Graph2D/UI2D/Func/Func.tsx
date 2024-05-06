import React, {KeyboardEvent} from "react";
import { TFunction } from "../../Graph2D";

export type TFunc = {
    func: TFunction;
}

const Func: React.FC<TFunc> = (props: TFunc) => {
    const { func } = props;

    const changeFunction = (event: KeyboardEvent<HTMLInputElement>) => {
        try {
            let f = () => 0;
            eval(`f = function(x) {return ${event.currentTarget.value};}`);
            func.f = f;
        } catch {

        }
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