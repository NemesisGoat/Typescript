import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import Graph2D from './components/Graph2D/Graph2D';
import Graph3D from './components/Graph3D/Graph3D';
import Calc from './components/Calc/Calc';

export enum EPAGES {
  CALC,
  GRAPH2D,
  GRAPH3D
}

const App: React.FC = () => {
  const[pageName, setPageName] = useState<EPAGES>(EPAGES.CALC);
  return (<div className="app">
    <Header setPageName = {setPageName}/>
    {pageName === EPAGES.CALC && <Calc/>}
    {pageName === EPAGES.GRAPH3D && <Graph3D/>}
    {pageName === EPAGES.GRAPH2D && <Graph2D/>}
      </div>);
}

export default App;
