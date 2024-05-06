import React, {useEffect} from "react";
import Graph from "../../modules/Graph/Graph";
import useGraph from "../../modules/Graph/useGraph";
import UI2D from "./UI2D/UI2D";

type TF = (x:number) => number;

export type TFunction = {
    f: TF;
    color?: string;
    width?: number;
    a?: number;
    b?: number;
    getPerivative?: boolean;
    perivative?: any;
}
const Graph2D: React.FC = () => {
    const WIN = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20
    };
    let graph: Graph | null;
    const [getGraph, cancelGraph] = useGraph(render);

    let useInterpolation:boolean = false;

    let coordX:number = 0;

    let isDragging:boolean = false;
    let xDrag:number = 0;
    let yDrag:number = 0;

    const drawn: TFunction[] = [];
    const points: {x: number, y: number}[] = [];

    const wheel = (event:WheelEvent) => {
        const delta = 1 + (0.25 * (Math.abs(event.deltaY) / event.deltaY));
        WIN.HEIGHT = WIN.HEIGHT * delta;
        WIN.WIDTH = WIN.WIDTH * delta;
        WIN.BOTTOM = WIN.BOTTOM * delta;
        WIN.LEFT = WIN.LEFT * delta;
            }


    const mousedown = (event:MouseEvent) => {
        if (!graph) {
            return;
        }
        xDrag = event.offsetX;
        yDrag = event.offsetY;
        if (event.button === 1) {
            let xRight = graph.sx(event.offsetX + 5);
            let xLeft = graph.sx(event.offsetX - 5);
            let yDown = graph.sy(event.offsetY + 5) + (WIN.HEIGHT + 2 * WIN.BOTTOM);
            let yUp = graph.sy(event.offsetY - 5) + (WIN.HEIGHT + 2 * WIN.BOTTOM);
            points.forEach((point, index) => {
                if (point.x >= xLeft && point.x <= xRight) {
                    if (point.y >= yDown && point.y <= yUp) {
                        points.splice(index, 1);
                        
                    }
                }
            })
            return;
        }
        if (useInterpolation) {
            points.push({ x: graph.sx(event.offsetX), y: graph.sy(event.offsetY) + (WIN.HEIGHT + 2 * WIN.BOTTOM) });
            points.sort((a, b) => b.x - a.x);
            
            return;
        }
        isDragging = true;
    }

    const mousemove = (event:MouseEvent) => {
        if (!graph) {
            return;
        }

        if (isDragging) {
            WIN.LEFT = graph.sx(xDrag - event.offsetX);
            WIN.BOTTOM = -graph.sy(-yDrag + event.offsetY);
            
            xDrag = event.offsetX;
            yDrag = event.offsetY;
        }
    }

    const mouseup = (event:MouseEvent) => {
        xDrag = event.offsetX;
        yDrag = event.offsetY;
        isDragging = false;
    }

    const mouseleave = () => {
        isDragging = false;
    }

    const getX = (event:MouseEvent) => {
        if (!graph) {
            return;
        }
        coordX = graph.sx(event.offsetX);
        drawn.forEach((item, index) => {
            if (item && item.getPerivative) {
                getPerivative(item.f, coordX, 0.001, index);
            }
        })
    }

    function addFunction(func:TF, num:number) {
        if (drawn[num]) {
            drawn[num].f = func;
        } else {
            drawn[num] = {
                f: func,
                getPerivative: false,
                perivative: function (x:number) { return drawn[num].f }
            }
        }
        

    }

    function colorFunction(color:string, num:number) {
        drawn[num].color = color;
        
    }

    function getPerivativeOn(num:number) {
        if (drawn[num].getPerivative) {
            drawn[num].getPerivative = false;
            drawn[num].perivative = function (x:number) { return drawn[num].f };
        } else {
            drawn[num].getPerivative = true;
        }
        
    }

    //Рисует систему координат
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

        //Оси координат
        graph.line(WIN.LEFT, 0, WIN.WIDTH + WIN.LEFT, 0, 'black', 4);
        graph.line(0, WIN.BOTTOM + WIN.HEIGHT, 0, WIN.BOTTOM, 'black', 4);

        //Рисочки
        for (let i = -1; i > WIN.LEFT; i--) {
            graph.line(i, 0.1, i, -0.1, '#000', 4);
            graph.print(i - 0.3, -0.3, i, 'black', 350)
        }

        for (let i = 0; i < WIN.WIDTH + WIN.LEFT; i++) {
            graph.line(i, 0.1, i, -0.1, '#000', 4);
            graph.print(i - 0.2, -0.3, i, 'black', 350)
        }

        for (let i = -1; i > WIN.BOTTOM; i--) {
            graph.line(0.1, i, -0.1, i, '#000', 4);
            graph.print(-0.4, i - 0.2, i, 'black', 350)
        }

        for (let i = 1; i < WIN.HEIGHT + WIN.BOTTOM; i++) {
            graph.line(0.1, i, -0.1, i, '#000', 4);
            graph.print(-0.3, i - 0.2, i, 'black', 350)
        }
    }

    const printFunction = (f:TF, color:string = '#000', width:number = 2, n:number = 1200): void => {
        if (!graph) {
            return;
        }
        let x:number = WIN.LEFT;
        const dx:number = WIN.WIDTH / n;
        while (x <= WIN.WIDTH + WIN.LEFT) {
            graph.line(x, f(x), x + dx, f(x + dx), color, 2);
            x += dx;
            if (f(x) * f(x + dx) <= 0) {
                graph.point(getZero(f, x, x + dx, 0.001), 0, color, 6);
            }
        }
    }


    const printFunctions = (): void => {
        drawn.forEach(item => item && printFunction(item.f, item.color, item.width))
    }

    const getZero = (f:TF, a:number, b:number, eps:number = 0.01): any => {
        if (Math.abs(f(a)) + Math.abs(f(b)) >= 10) return null;
        if (f(a) * f(b) > 0) return null;
        if (Math.abs(f(a) - f(b)) <= eps) {
            return (a + b) / 2;
        };
        const half = (a + b) / 2;
        if (f(a) * f(half) <= 0) {
            return getZero(f, a, half, eps);
        };
        if (f(half) * f(b) <= 0) {
            return getZero(f, half, b, eps);
        }
    }

    function getPerivative(f:TF, x:number, dx:number, num:number) {
        let k:number = (f(x + dx) - f(x)) / dx;
        let b:number = f(x) - k * x;
        drawn[num].perivative = function (x:number) {
            return k * x + b;
        }
        
    }

    function printPerivative():void {
        if (!graph) {
            return;
        }
        drawn.forEach((item, index) => {
            if (item && item.perivative) {
                let f = item.perivative;
                let n = 1;
                let x = WIN.LEFT;
                let dx = WIN.WIDTH / n;
                while (x <= WIN.WIDTH + WIN.LEFT) {
                    graph.dashedLine(x, f(x), x + dx, f(x + dx), item.color, 2);
                    x += dx;
                }
            }
        })
    }

    function interpolation(): void {
        if (!graph) {
            return;
        }
        if (points.length > 1) {
            for (let i = 0; i < points.length - 1; i++) {
                graph.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y, 'black', 3);
            }
        }
    }

    function render(): void {
        if (!graph) {
            return;
        }
        graph.clear();
        grid();
        printFunctions();
        printPerivative();
        points.forEach(point => point && graph.point(point.x, point.y, 'black', 5))
        interpolation();
    }

    render();

    useEffect(() => {
        //@ts-ignore
        const graph = getGraph({
            WIN,
            id: 'canvas',
            width: 600,
            heigth: 600,
            callbacks: {
                wheel,
                mousemove,
                mouseup,
                mousedown,
                mouseleave,
            }
        });

        console.log(graph);

        return () => {
            cancelGraph();
        }
    })

    return (<div>
        <div><h1>hgsdjgk</h1></div>
        <UI2D funcs={drawn}></UI2D>
    </div>)
}

export default Graph2D;