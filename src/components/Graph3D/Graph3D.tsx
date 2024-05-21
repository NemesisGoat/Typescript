import { MouseEventHandler, useEffect, React } from "react";
import useGraph, { TWIN3D, Graph } from '../../modules/Graph';
import Math3D, {
    Point, Light, Polygon, EDistance, Sphera, Cube
} from "../../modules/Math3D";
import Checkbox3D from "./Checkbox3D/Checkbox3D";

export enum ECustom {
    showPoints = 'showPoints',
        showEdges = 'showEdges',
        showPolygons = 'showPolygons',
        animationOn = 'animationOn'
}

enum ESurface {
    sphera = Sphera;
}

const Graph3D = () => {
    const WIN: TWIN3D = {
        LEFT: -5,
        BOTTOM: -5,
        WIDTH: 10,
        HEIGHT: 10,
        CENTER: new Point(0, 0, -40),
        CAMERA: new Point(0, 0, -50)
    }
    let graph: Graph | null = null;
    const [getGraph, cancelGraph] = useGraph(renderScene);
    const LIGHT = new Light(-40, 15, 0, 1500);
    const math3D = new Math3D({ WIN });
    let scene = [new Sphera()];
    // флажки
    let canMove = false;

    const custom = {
        [ECustom.showPoints]: false,
        [ECustom.showEdges]: false,
        [ECustom.showPolygons]: true,
        [ECustom.animationOn]: true
    }

    let dx = 0;
    let dy = 0;

    function mouseup() {
        canMove = false;
    }

    function mouseleave() {
        canMove = false;
    }

    function mousedown() {
        canMove = true;
    }

    // надо как-то поменять
    function mousemove(event: MouseEvent) {
        const gradus = Math.PI / 180 / 4;
        if (canMove) {
            scene.forEach(surface =>
                surface.points.forEach(point => {
                    const T1 = math3D.rotateOy((dx - event.offsetX) * gradus);
                    const T2 = math3D.rotateOx((dy - event.offsetY) * gradus);
                    const T = math3D.getTransform(T1, T2);
                    math3D.transform(T, point);
                })
            );
        }
        dx = event.offsetX;
        dy = event.offsetY;
    }

    function wheel(event: WheelEvent) {
        event.preventDefault();
        const delta = (event.deltaY > 0) ? 1.1 : 0.9;
        const matrix = math3D.zoom(delta);
        scene.forEach(surface =>
            surface.points.forEach(point =>
                math3D.transform(matrix, point)
            )
        );
    }

    function renderScene(FPS: number): void {
        if (!graph) {
            return;
        }
        graph.clear();
        if (custom.showPolygons) {
            const polygons: Polygon[] = [];
            scene.forEach((surface, index) => {
                math3D.calcDistance(surface, WIN.CAMERA, EDistance.distance);
                math3D.calcDistance(surface, LIGHT, EDistance.lumen);
                surface.polygons.forEach(polygon => {
                    polygon.index = index;
                    polygons.push(polygon);
                });
            });
            math3D.sortByArtistAlgorithm(polygons);
            polygons.forEach(polygon => {
                const points = polygon.points.map(index =>
                    new Point(
                        math3D.xs(scene[polygon.index].points[index]),
                        math3D.ys(scene[polygon.index].points[index])
                    )
                );
                const lumen = math3D.calcIllumination(polygon.lumen, LIGHT.lumen);
                let { r, g, b } = polygon.color;
                r = Math.round(r * lumen);
                g = Math.round(g * lumen);
                b = Math.round(b * lumen);
                graph && graph.polygon(points, polygon.rgbToHex(r, g, b));
            });
        }

        if (custom.showPoints) {
            scene.forEach(surface =>
                surface.points.forEach(point => {
                    graph && graph.point(
                        math3D.xs(point),
                        math3D.ys(point),
                        '#000000'
                    );
                })
            );
        }

        if (custom.showEdges) {
            scene.forEach(surface =>
                surface.edges.forEach(edge => {
                    const point1 = surface.points[edge.p1];
                    const point2 = surface.points[edge.p2];
                    graph && graph.line(
                        math3D.xs(point1), math3D.ys(point1),
                        math3D.xs(point2), math3D.ys(point2),
                        '#800080');
                })
            );
        }
    }
    
    const changeValue = (flag: ECustom, value: boolean) => {
        custom[flag] = value;
    }

    const changeScene = (event: React.ChangeEvent<HTMLSelectElement>) => {
        switch (event.target.value) {
            case 'Sphera': scene = [new Sphera()]; break;
            case 'Cube': scene = [new Cube()]; break;
        }
    }

    useEffect(() => {
        graph = getGraph({
            WIN,
            id: 'graph3DCanvas',
            width: 500,
            height: 500,
            callbacks: {
                wheel,
                mousemove,
                mouseup,
                mousedown,
                mouseleave,
            },
        });

        const interval = setInterval(() => {
            if (custom.animationOn) {
                scene.forEach(surface => surface.doAnimation(math3D));
            }
        }, 50);

        return () => {
            clearInterval(interval);
            cancelGraph();
        }
    });

    return (<div className="beautyDiv">
        <button id="move">move</button>
        <canvas id='graph3DCanvas' />
        <div className="checkbox">
            <Checkbox3D
                text="Точки"
                id="points"
                custom={ECustom.showPoints}
                customValue={custom[ECustom.showPoints]}
                changeValue={changeValue}
            />
            <Checkbox3D
                text="Точки"
                id="edges"
                custom={ECustom.showEdges}
                customValue={custom[ECustom.showEdges]}
                changeValue={changeValue}
            />
            <Checkbox3D
                text="Точки"
                id="polygons"
                custom={ECustom.showPolygons}
                customValue={custom[ECustom.showPolygons]}
                changeValue={changeValue}
            />
            <Checkbox3D
                text="Точки"
                id="animation"
                custom={ECustom.animationOn}
                customValue={custom[ECustom.animationOn]}
                changeValue={changeValue}
            />
        </div>
        <div>
            <select onChange={changeScene} className="selectFigures">
                <option value="0">фигурки</option>
                <option value="cube">кубик</option>
                <option value="pyramid">пирамидка</option>
                <option value="sphera">сфера</option>
                <option value="torus">Бог грома</option>
                <option value="KleinBottle">бутылка Клейна</option>
                <option value="cone">конус</option>
                <option value="ellipsoid">эллипсоид</option>
                <option value="hyperbolicCylinder">гиперболический цилиндр</option>
                <option value="parabolicCylinder">параболический цилиндр</option>
                <option value="ellipticalCylinder">эллиптический цилиндр</option>
                <option value="singleStripHyperboloid">однополосной гиперболоид</option>
                <option value="doubleStripHyperboloid">двуполосной гиперболоид</option>
                <option value="ellipticalParaboloid">эллиптический параболоид</option>
                <option value="hyperbolicParaboloid">чипсина</option>
            </select>
        </div>
    </div>);
}

export default Graph3D;