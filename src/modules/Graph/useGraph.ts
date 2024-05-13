import Graph, { TGraph } from "./Graph";

<<<<<<< Updated upstream
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
=======
const requestAnimFrame: (callback: () => void) => number = (function () {
    return window.requestAnimationFrame ||
        (<any>window).webkitRequestAnimationFrame ||
        (<any>window).mozRequestAnimationFrame ||
        (<any>window).oRequestAnimationFrame ||
        (<any>window).msRequestAnimationFrame ||
>>>>>>> Stashed changes
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

<<<<<<< Updated upstream
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
=======
const useGraph = (
    renderScene: (FPS: number) => void
): [(options: TGraph) => Graph, () => void] => {
    let graph = null;
    let currentFPS = 0;
    let FPS = 0;
    let timestamp = Date.now();
    let id: number;

    const animLoop = () => {
        FPS++;
        const currentTimestamp = Date.now();
        if (currentTimestamp - timestamp >= 1000) {
            timestamp = currentTimestamp;
            currentFPS = FPS;
            FPS = 0;
        }
        renderScene(currentFPS);
        id = requestAnimFrame(animLoop);
    }

    const getGraph = (options: TGraph): Graph => {
        graph = new Graph(options);
        animLoop();
        return graph;
    }

    const cancelGraph = (): void => {
        window.cancelAnimationFrame(id);
>>>>>>> Stashed changes
        graph = null;
    }

    return [getGraph, cancelGraph];
}

export default useGraph;