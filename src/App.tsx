import React, { useState } from 'react';
import Header from './components/Header/Header';
import Graph2D from './components/Graph2D/Graph2D';
import Graph3D from './components/Graph3D/Graph3D';
import Calc from './components/Calc/Calc';

import './App.css';

export enum EPAGES {
    GRAPH_3D = 'Graph3D',
    GRAPH_2D = 'Graph2D',
    CALC = 'Calc',
}

const App: React.FC = () => {
    const [pageName, setPageName] = useState<EPAGES>(EPAGES.GRAPH_3D);

    return (<>
        <Header setPageName={setPageName} />
        {pageName === EPAGES.GRAPH_2D && <Graph2D />}
        {pageName === EPAGES.GRAPH_3D && <Graph3D />}
        {pageName === EPAGES.CALC && <Calc />}
    </>);
}

export default App;
