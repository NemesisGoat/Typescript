import React from "react";
import { EPAGES } from "../../App";

type THeader = {
    setPageName: (name: EPAGES) => void;
}

const Header: React.FC <THeader> = (props: THeader) => {

    const { setPageName } = props;
    return (<>
        <h1>Хедер!</h1>
        <button onClick={() => setPageName(EPAGES.GRAPH3D)}>3D графика</button>
        <button onClick={() => setPageName(EPAGES.GRAPH2D)}>2D графика</button>
        <button onClick={() => setPageName(EPAGES.CALC)}>Калькулятор</button>
    </>);
}

export default Header;