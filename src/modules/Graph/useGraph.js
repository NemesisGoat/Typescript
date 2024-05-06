import Graph from "./Graph";

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

const useGraph = (renderScene) => {
    let graph = null;
    let FPS = 0;
    let countFPS = 0;
    let timestamp = Date.now();

    const renderLoop = () => {
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

    const getGraph = (options) => {
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