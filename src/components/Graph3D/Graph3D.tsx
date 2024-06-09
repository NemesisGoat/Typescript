import { useEffect } from "react";
import useGraph, { TWIN3D, Graph } from '../../modules/Graph';
import Math3D, {
    Point, Light, Polygon, EDistance, Sphere, Cube, Ellipsoid,
    Thor,
    TwoSurfaceHyperboloid,
    EllipticCylinder,
    EllipticParaboloid,
    HyperbolicCylinder,
    HyperbolicParaboloid,
    OneSurfaceHyperboloid,
    KleinBottle,
    Cone
} from "../../modules/Math3D";
import Surface from "../../modules/Math3D/entites/Surface";
import Checkbox3D from "./Checkbox3D/Checkbox3D";
import React from "react";
import { TObjectVector } from "../../modules/Math3D/Math3D";

export enum ECustom {
    showPoints = 'showPoints',
    showEdges = 'showEdges',
    showPolygons = 'showPolygons',
    animationOn = 'animationOn',
}

type TPoint2D = {
    x: number;
    y: number;
}

const Graph3D = () => {
    const WIN: TWIN3D = {
        LEFT: -5,
        BOTTOM: -5,
        WIDTH: 10,
        HEIGHT: 10,
        P1: new Point(-10, 10, -30),
        P2: new Point(-10, -10, -30),
        P3: new Point(10, -10, -30),
        CENTER: new Point(0, 0, -40),
        CAMERA: new Point(0, 0, -50)
    }
    let graph: Graph | null = null;
    const [getGraph, cancelGraph] = useGraph(renderScene);
    let LIGHT = new Light(-40, 15, -10, 1500);
    const math3D = new Math3D({ WIN });
    let scene: Surface[] = [new (Cube)];
    // флажки
    let canMove = false;
    const custom = {
        [ECustom.showPoints]: false,
        [ECustom.showEdges]: false,
        [ECustom.showPolygons]: true,
        [ECustom.animationOn]: false,
    }
    let dx = 0;
    let dy = 0;
    let P1P2: TObjectVector;
    let P2P3: TObjectVector;

    function mouseup() {
        canMove = false;
    }

    function mouseleave() {
        canMove = false;
    }

    function mousedown() {
        canMove = true;
    }

    function mousemove(event: MouseEvent) {
        if (canMove) {
            const gradus = Math.PI / 180 / 4;
            const matrixOx = math3D.rotateOx((dx - event.offsetX) * gradus);
            const matrixOy = math3D.rotateOy((-dy + event.offsetY) * gradus);
            math3D.transform(matrixOx, WIN.CAMERA);
            math3D.transform(matrixOx, WIN.CENTER);
            math3D.transform(matrixOx, WIN.P1);
            math3D.transform(matrixOx, WIN.P2);
            math3D.transform(matrixOx, WIN.P3);
            math3D.transform(matrixOy, WIN.CAMERA);
            math3D.transform(matrixOy, WIN.CENTER);
            math3D.transform(matrixOy, WIN.P1);
            math3D.transform(matrixOy, WIN.P2);
            math3D.transform(matrixOy, WIN.P3);
        }
        dx = event.offsetX;
        dy = event.offsetY;
    }

    function wheel(event: WheelEvent) {
        event.preventDefault();
        const delta = (event.deltaY > 0) ? 1.2 : 0.8;
        const matrix = math3D.zoom(delta);
        math3D.transform(matrix, WIN.CAMERA);
        math3D.transform(matrix, WIN.CENTER);
    }

    function calcPlaneEquation(): void {
        math3D.calcPlaneEquation(WIN.CAMERA, WIN.CENTER)
    }

    function getProection(point: Point): TPoint2D {
        const M = math3D.getProection(point);
        const P2M = math3D.getVector(WIN.P2, M);
        const cosa = math3D.calcCorner(P1P2, M);
        const cosb = math3D.calcCorner(P2P3, M);
        const module = math3D.moduleVector(P2M);
        return {
            x: cosa * module,
            y: cosb * module
        }
    }

    function calcWindowVectors(): void {
        P1P2 = math3D.getVector(WIN.P2, WIN.P1);
        P2P3 = math3D.getVector(WIN.P3, WIN.P2);
    }

    function renderScene(FPS: number): void {
        if (!graph) {
            return;
        }
        graph.clear();
        calcPlaneEquation();
        calcWindowVectors();
        if (custom.showPolygons) {
            const polygons: Polygon[] = [];
            scene.forEach((surface, index) => {
                math3D.calcDistance(surface, WIN.CAMERA, EDistance.distance);
                math3D.calcDistance(surface, LIGHT, EDistance.lumen);
                math3D.calcCenter(surface);
                math3D.calcRadius(surface);
                math3D.calcVisibiliy(surface, WIN.CAMERA);
                surface.polygons.forEach((polygon) => {
                    polygon.index = index;
                    polygons.push(polygon);
                });
            });
            math3D.sortByArtistAlgorithm(polygons);
            polygons.forEach((polygon) => {
                //
                //
                //
                // починить расчёт видимости
                //
                //
                //
                if (true) {
                    const points = polygon.points.map(index =>
                        new Point(
                            getProection(scene[polygon.index].points[index]).x,
                            getProection(scene[polygon.index].points[index]).y
                        )
                    );
                    const { isShadow, dark } = math3D.calcShadow(polygon, scene, LIGHT);
                    const lumen = math3D.calcIllumination(polygon.lumen, LIGHT.lumen * (isShadow ? dark : 1));
                    let { r, g, b } = polygon.color;
                    r = Math.round(r * lumen);
                    g = Math.round(g * lumen);
                    b = Math.round(b * lumen);
                    graph && graph.polygon(points, polygon.rgbToHex(r, g, b));
                }
            });
        }

        if (custom.showPoints) {
            scene.forEach(surface =>
                surface.points.forEach((point, index) => {
                    graph && graph.point(
                        getProection(point).x,
                        getProection(point).y,
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
                        getProection(point1).x, getProection(point1).y,
                        getProection(point2).x, getProection(point2).y,
                        edge.color, 1);
                })
            );
        }
        graph.print(2, 2, 'FPS:' + FPS.toString(), '#000000', 200);
    }

    const changeValue = (flag: ECustom, value: boolean) => {
        custom[flag] = value;
    }

    const changeScene = (event: React.ChangeEvent<HTMLSelectElement>) => {
        switch (event.target.value) {
            case 'Sphere': scene = [new Sphere()]; break;
            case 'Cube': scene = [new Cube()]; break;
            case 'Ellipsoid': scene = [new Ellipsoid()]; break;
            case 'Cone': scene = [new Cone()]; break;
            case 'Thor': scene = [new Thor()]; break;
            case 'TwoSurfaceHyperboloid': scene = [new TwoSurfaceHyperboloid()]; break;
            case 'OneSurfaceHyperboloid': scene = [new OneSurfaceHyperboloid()]; break;
            case 'EllipticCylynder': scene = [new EllipticCylinder()]; break;
            case 'HyperbolicCylinder': scene = [new HyperbolicCylinder()]; break;
            case 'EllipticParaboloid': scene = [new EllipticParaboloid()]; break;
            case 'HyperbolicParaboloid': scene = [new HyperbolicParaboloid()]; break;
            case 'KleinBottle': scene = [new KleinBottle()]; break;
        }
    }

    const changeLumen = (event: React.ChangeEvent<HTMLInputElement>) => {
        LIGHT.lumen = Number(event.target.value);
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

        calcPlaneEquation();
        calcWindowVectors();

        return () => {
            clearInterval(interval);
            cancelGraph();
        }
    });

    return (<div className="beautyDiv">
        <canvas id='graph3DCanvas' />
        <div className="checkbox">
            <Checkbox3D
                text="точки"
                id="points"
                custom={ECustom.showPoints}
                customValue={custom[ECustom.showPoints]}
                changeValue={changeValue}
            />
            <Checkbox3D
                text="рёбра"
                id="edges"
                custom={ECustom.showEdges}
                customValue={custom[ECustom.showEdges]}
                changeValue={changeValue}
            />
            <Checkbox3D
                text="полигоны"
                id="polygons"
                custom={ECustom.showPolygons}
                customValue={custom[ECustom.showPolygons]}
                changeValue={changeValue}
            />
            <Checkbox3D
                text="анимация"
                id="animation"
                custom={ECustom.animationOn}
                customValue={custom[ECustom.animationOn]}
                changeValue={changeValue}
            />
        </div>
        <div>
            <select onChange={changeScene} className="selectFigures">
                <option value="Cube">Куб</option>
                <option value="Sphere">Сфера</option>
                <option value="Ellipsoid">Эллипсоид</option>
                <option value="Cone">Конус</option>
                <option value="TwoSurfaceHyperboloid">Двуполостной гиперболоид</option>
                <option value="OneSurfaceHyperboloid">Однополостной гиперболоид</option>
                {/* починить */}
                <option value="EllipticCylynder">Эллиптический цилиндр</option>
                <option value="EllipticParaboloid">Эллиптический параболоид</option>
                <option value="HyperbolicCylinder">Гиперболический цилиндр</option>
                <option value="HyperbolicParaboloid">Гиперболический параболоид</option>
                <option value="KleinBottle">Бутылка Клейна</option>
            </select>
        </div>
        <input onChange={changeLumen} type="range" id="changeLumen" name="lumenLevel" min={0} max={4000} defaultValue={1500}></input>
        <label htmlFor="lumenLevel"> Уровень освещения</label>
    </div>);
}

export default Graph3D;