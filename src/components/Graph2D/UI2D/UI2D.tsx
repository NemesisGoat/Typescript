<<<<<<< Updated upstream
import React, { useState } from "react"
import { TFunc } from "./Func/Func"
import { TFunction } from "../Graph2D"
import useMyFunction from "./hooks/useMyFunction"

=======
import React, { useState } from "react";
import { TFunction } from "../Graph2D";
import useMyFunction from "./hooks/useMyFunction";
import Func from "./Func/Func";
>>>>>>> Stashed changes

type TUI2D = {
    funcs: TFunction[];
    //funcs: Array<TFunction>;
}

const UI2D: React.FC<TUI2D> = (props: TUI2D) => {
    const { funcs } = props;
    const [count, setCount] = useState<number>(funcs.length);
    const [getFunction] = useMyFunction();

    const addFunction = () => {
        funcs.push({
<<<<<<< Updated upstream
            f: getFunction(0),
=======
            f: getFunction('0'),
>>>>>>> Stashed changes
            color: 'black',
            width: 2
        });
        setCount(funcs.length);
    }

    const delFunction = (index: number): void => {
        funcs.splice(index, 1)
        setCount(funcs.length);
    }

    return (<div>
        <button onClick={addFunction} className="beautyButton">+</button>
        <div>
            {funcs.map((func, index) =>
                <Func 
                    key={`${index}${Math.random()}`} 
                    func={func} 
                    index={index}
                    delFunction={delFunction}
                />
            )}
        </div>
    </div>);
}

export default UI2D;