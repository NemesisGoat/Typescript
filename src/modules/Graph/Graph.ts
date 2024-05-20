import Point from "../Math3D/entites/Point";

export type TWIN = {
    LEFT: number;
    BOTTOM: number;
    WIDTH: number;
    HEIGHT: number;
}

export type TWIN2D = {
    LEFT: number;
    BOTTOM: number;
    WIDTH: number;
    HEIGHT: number;
}

export type TWIN3D = TWIN2D & {
    CAMERA: Point;
    CENTER: Point
}

export type TGraph = {
    id?: string;
    width?: number;
    height?: number;
    WIN: TWIN,
    callbacks: {
        wheel: (event: WheelEvent) => void;
        mousemove: (event: MouseEvent) => void;
        mouseleave: () => void;
        mouseup: (event: MouseEvent) => void;
        mousedown: (event: MouseEvent) => void;
    };
}

class Graph {
    private canvas: HTMLCanvasElement;
    private canvasV: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private contextV: CanvasRenderingContext2D;
    private PI2 = 2 * Math.PI;
    private WIN: TWIN;

    constructor({ id, width = 300, height = 300, WIN, callbacks }: TGraph) {
        if (id) {
            this.canvas = document.getElementById(id) as HTMLCanvasElement;
        } else {
            this.canvas = document.createElement('canvas');
            document.querySelector('body')?.appendChild(this.canvas);
        };

        this.canvas.width = width;
        this.canvas.height = height;
        this.canvasV = document.createElement('canvas');
        this.canvasV.width = width;
        this.canvasV.height = height;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.contextV = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.WIN = WIN;

        const { wheel, mousemove, mouseleave, mouseup, mousedown } = callbacks;
        this.canvas.addEventListener("wheel", wheel);
        this.canvas.addEventListener("mousemove", mousemove);
        this.canvas.addEventListener("mouseleave", mouseleave);
        this.canvas.addEventListener("mouseup", mouseup);
        this.canvas.addEventListener("mousedown", mousedown);
    }

    xs(x: number): number {
        return (x - this.WIN.LEFT) / this.WIN.WIDTH * this.canvasV.width;
    }
    ys(y: number): number {
        return (this.WIN.HEIGHT - (y - this.WIN.BOTTOM)) / this.WIN.HEIGHT * this.canvasV.height;
    }

    sx(x: number): number {
        return x * this.WIN.WIDTH / this.canvasV.width;
    }
    sy(y: number): number {
        return -y * this.WIN.HEIGHT / this.canvasV.height;
    }

    clear(): void {
        this.contextV.clearRect(0, 0, this.canvasV.width, this.canvasV.height)
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    line(x1: number, y1: number, x2: number, y2: number, color = '#b55a5d', width = 2): void {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.lineWidth = width;
        this.contextV.moveTo(this.xs(x1), this.ys(y1));
        this.contextV.lineTo(this.xs(x2), this.ys(y2));
        this.contextV.stroke();
        this.contextV.closePath();
    }

    point(x: number, y: number, color = '#b55a5d', size = 2): void {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.fillStyle = color;
        this.contextV.arc(this.xs(x), this.ys(y), size, 0, 2 * Math.PI);
        this.contextV.stroke();
        this.contextV.fill();
        this.contextV.closePath();
    }

    print(
        x: number,
        y: number,
        text: string,
        color = '#000',
        size = 350,
        isGraphName = true
    ): void {
        this.contextV.font = size / this.WIN.WIDTH + "px Verdana";
        this.contextV.fillStyle = color;
        this.contextV.fillText(text, this.xs(x), this.ys(y));
        this.contextV.stroke();
    };

    polygon(points: Omit<Point, 'z'>[], color = 'purple'): void {
        this.context.beginPath();
        this.context.fillStyle = color;
        this.context.moveTo(this.xs(points[0].x), this.ys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.context.lineTo(this.xs(points[i].x), this.ys(points[i].y));
        }
        this.context.lineTo(this.xs(points[0].x), this.ys(points[0].y));
        this.context.closePath();
        this.context.fill();
    }
}

export default Graph;
