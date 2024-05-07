import Graph, { TGraph } from "./Graph";

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

const useGraph = (renderScene: (FPS: number) => void): [(options: TGraph) => Graph, () => void] => {
    let graph = null;
    let FPS = 0;
    let countFPS = 0;
    let timestamp = Date.now();

    const renderLoop = (): void => {
        countFPS++;
        const currentTimestamp = Date.now();
        if (currentTimestamp - timestamp >= 1000) {
            FPS = countFPS;
            countFPS = 0;
            timestamp = currentTimestamp;
        }

        renderScene(FPS);
        window.requestAnimationFrame(renderLoop);
    }

    const getGraph = (options: TGraph): Graph => {
        const graph = new Graph({
            options
        });
        renderLoop();
        console.log(graph, options);
        return graph;
    }

    const cancelGraph = () => {
        window.cancelAnimationFrame(renderLoop);
        graph = null;
    }

    return [getGraph, cancelGraph];
}

export default useGraph;