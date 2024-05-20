import React, { useEffect } from "react";
import useGraph from "../../modules/Graph/useGraph";
import UI2D from "./UI2D/UI2D";
import Graph from "../../modules/Graph/Graph";
import "./Graph2D.css";

export type TF = (x: number) => number;

export type TFunction = {
    f: TF;
    color: string;
    width: number;
    getPerivative?: boolean;
    perivative?: (x: number) => TF;
}

const Graph2D: React.FC = () => {
    const WIN = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20
    }
    let graph: Graph | null = null;
    const [getGraph, cancelGraph] = useGraph(render);

    const funcs: TFunction[] = [];
    let isDragging = false;
    let xDrag = 0;
    let yDrag = 0;
    let useInterpolation = false;
    let coordX = 0;

    const wheel = (event: WheelEvent) => {
        const delta = 1 + (0.25 * (Math.abs(event.deltaY) / event.deltaY));
        WIN.HEIGHT = WIN.HEIGHT * delta;
        WIN.WIDTH = WIN.WIDTH * delta;
        WIN.BOTTOM = WIN.BOTTOM * delta;
        WIN.LEFT = WIN.LEFT * delta;
    };

    const mouseup = () => {
        isDragging = false;
    };

    const mouseleave = () => {
        isDragging = false;
    };

    const mousedown = () => {
        isDragging = true;
    };

    const mousemove = (event: MouseEvent) => {
        if (isDragging && graph) {
            WIN.LEFT -= graph.sx(event.movementX);
            WIN.BOTTOM -= graph.sy(event.movementY);
        }
    };

    // const getX = (event: MouseEvent) => {
    //     if (graph) {
    //         coordX = graph.sx(event.offsetX);
    //         funcs.forEach((item, index) => {
    //             if (item && item.f && item.getPerivative) {
    //                 getPerivative(item.f, coordX, 0.001, index);
    //             }
    //         })
    //     }
    // }

    const grid = (): void => {
        if (!graph) {
            return;
        }

        for (let i = -1; i >= WIN.LEFT; i = i - 1) {
            graph.line(i, WIN.HEIGHT + WIN.BOTTOM, i, WIN.BOTTOM, 'rgb(70, 70, 70)', 1);
        }

        for (let i = 0; i <= WIN.WIDTH + WIN.LEFT; i = i + 1) {
            graph.line(i, WIN.HEIGHT + WIN.BOTTOM, i, WIN.BOTTOM, 'rgb(70, 70, 70)', 1);
        }

        for (let i = -1; i >= WIN.BOTTOM; i = i - 1) {
            graph.line(WIN.LEFT, i, WIN.WIDTH + WIN.LEFT, i, 'rgb(70, 70, 70)', 1);
        }

        for (let i = 1; i <= WIN.HEIGHT + WIN.BOTTOM; i = i + 1) {
            graph.line(WIN.LEFT, i, WIN.WIDTH + WIN.LEFT, i, 'rgb(70, 70, 70)', 1);
        }

        //оси координат
        graph.line(WIN.LEFT, 0, WIN.WIDTH + WIN.LEFT, 0, 'black', 4);
        graph.line(0, WIN.BOTTOM + WIN.HEIGHT, 0, WIN.BOTTOM, 'black', 4);


        //рисочки
        for (let i = -1; i > WIN.LEFT; i--) {
            graph.line(i, 0.1, i, -0.1, '#000', 4);
            graph.print(i - 0.3, -0.3, String(i), 'black', 350)
        }

        for (let i = 0; i < WIN.WIDTH + WIN.LEFT; i++) {
            graph.line(i, 0.1, i, -0.1, '#000', 4);
            graph.print(i - 0.2, -0.3, String(i), 'black', 350)
        }

        for (let i = -1; i > WIN.BOTTOM; i--) {
            graph.line(0.1, i, -0.1, i, '#000', 4);
            graph.print(-0.4, i - 0.2, String(i), 'black', 350)
        }

        for (let i = 1; i < WIN.HEIGHT + WIN.BOTTOM; i++) {
            graph.line(0.1, i, -0.1, i, '#000', 4);
            graph.print(-0.3, i - 0.2, String(i), 'black', 350)
        }
    };

    const printFunction = (f: TF, color: string, strWidth: number, n = 200): void => {
        if (!graph) {
            return;
        }
        let x = WIN.LEFT;
        const dx = WIN.WIDTH / n;
        while (x <= WIN.WIDTH + WIN.LEFT) {
            graph.line(
                x,
                f(x),
                x + dx,
                f(x + dx),
                color,
                strWidth,
            );
            x += dx;
        };
    };

    //рендер.
    function render(FPS: number): void {
        if (!graph) {
            return;
        }
        graph.clear();
        grid();
        funcs.forEach(func =>
            func && printFunction(func.f, func.color, func.width)
        );
    };

    //поиск нуля функции 
    function getZero(f: TF, a: number, b: number, eps = 0.0001): number | null | undefined {
        if (f(a) * f(b) > 0) { return null; }
        if (Math.abs(f(a) - f(b)) <= eps) {
            return (a + b) / 2;
        }
        const half = (a + b) / 2;
        if (f(a) * f(half) <= 0) {
            return getZero(f, a, half, eps);
        }
        if (f(half) * f(b) <= 0) {
            return getZero(f, half, b, eps);
        }
    };

    useEffect(() => {
        // @ts-ignore
        graph = getGraph({
            WIN,
            id: 'canvas',
            width: 500,
            height: 500,
            callbacks: { wheel, mousemove, mouseleave, mouseup, mousedown }
        });

        return () => {
            cancelGraph();
        }
    });

    return (<div className="beautyDiv">
        <div>
            <canvas id='canvas' width='300' height='300' />
        </div>
        <UI2D funcs={funcs} />
    </div>);
}

export default Graph2D;