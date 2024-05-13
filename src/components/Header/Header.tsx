import React from "react";
import { EPAGES } from "../../App";

type THeader = {
    setPageName: (name: EPAGES) => void;
}

const Header: React.FC<THeader> = (props: THeader) => {
    const { setPageName } = props;

    return (<div>
        <button onClick={() => setPageName(EPAGES.GRAPH_2D)}>Графика 2Д</button>
        <button onClick={() => setPageName(EPAGES.GRAPH_3D)}>Графика 3Д</button>
        <button onClick={() => setPageName(EPAGES.CALC)}>Бульбулятор</button>
    </div>);
}

export default Header;