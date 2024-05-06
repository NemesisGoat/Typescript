import { useEffect } from "react";
import Point from "../../modules/Math3D/entities/Point";
import Light from "../../modules/Math3D/entities/Light";
import Math3D from "../../modules/Math3D/Math3D";
import Sphere from "../../modules/Math3D/surfaces/sphere";
import useGraph from "../../modules/Graph/Graph";

const Graph3D = () => {
    const WIN = {
        LEFT: -10,
        BOTTOM: -10,
        WIDTH: 20,
        HEIGHT: 20,
        P1: new Point(-10, 10, -30),
        P2: new Point(-10, -10, -30),
        P3: new Point(10, -10, -30),
        CENTER: new Point(0, 0, -30),
        CAMERA: new Point(0, 0, -50)
    }
    let graph = null;
    const [getGraph, cancelGraph] = useGraph(renderScene);
    const math3D = new Math3D({ WIN: WIN });
    const LIGHT = new Light(-40, 15, -10, 1500);
    const scene = SolarSystem();
    let drawPoints = true;
    let drawEdges = true;
    let drawPolygons = true;
    let canMove = false;
    let dx = 0;
    let dy = 0;

    function mouseup() {
        canMove = false;
    }

    function mousedown() {
        canMove = true;
    }

    function wheel(event) {
        event.preventDefault();
        const delta = (event.wheelDelta > 0) ? 1.2 : 0.8;
        const matrix = math3D.zoom(delta);
        math3D.transform(matrix, WIN.CAMERA);
        math3D.transform(matrix, WIN.CENTER);
    }

    function mousemove(event) {
        if (canMove) {
            const gradus = Math.PI / 180 / 4;
            const matrixOx = math3D.rotateOx((dx - event.offsetX) * gradus);
            const matrixOy = math3D.rotateOy((dy - event.offsetY) * gradus);
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

    function selectFigure() {
        const figure = document.getElementById('selectFigure').value;
        scene = [surfaces[figure]({})];
    }

    function SolarSystem() {
        const Sun = new Sphere({ color: '#ffff00', radius: 10 })
        Sun.addAnimation('rotateOy', 0.01);
        Sun.addAnimation('rotateOz', 0.01);
        const Earth = new Sphere({ color: '#0022ff', radius: 5, x0: 20 });
        Earth.addAnimation('rotateOy', 0.03, Sun.center);
        Earth.addAnimation('rotateOz', 0.05);
        const Moon = new Sphere({ color: '#969ba3', radius: 2, x0: Earth.center.x, y0: Earth.center.y, z0: Earth.center.z + 8 });
        Moon.addAnimation('rotateOx', 0.1, Earth.center);
        Moon.addAnimation('rotateOy', 0.03, Sun.center);
        return [Sun, Earth, Moon];
    }

    function calcPlaneEquation() {
        math3D.calcPlaneEquation(WIN.CAMERA, WIN.CENTER)
    }

    function getProection(point) {
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

    function calcWindowVectors() {
        const P1P2 = math3D.getVector(WIN.P2, WIN.P1);
        const P2P3 = math3D.getVector(WIN.P3, WIN.P2);
    }

    function renderScene(FPS) {
        console.log(FPS);
        graph.clear();
        if (drawPolygons) {
            const polygons = [];
            scene.forEach((surface, index) => {
                math3D.calcDistance(surface, WIN.CAMERA, 'distance');
                math3D.calcDistance(surface, LIGHT, 'lumen');
                math3D.calcCenter(surface);
                math3D.calcRadius(surface);
                math3D.calcVisibiliy(surface, WIN.CAMERA);
                surface.polygons.forEach(polygon => {
                    polygon.index = index;
                    polygons.push(polygon);
                });
            });

            math3D.sortByArtistAlgorithm(polygons);
            polygons.forEach(polygon => {
                if (polygon.visibility || scene.surface) {
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
                    graph.polygon(points, polygon.rgbToHex(r, g, b));
                }
            });
        }
        if (drawPoints) {
            scene.forEach(surface =>
                surface.points.forEach(
                    point => graph.point(
                        getProection(point).x,
                        getProection(point).y
                    )
                )
            );
        }
        if (drawEdges) {
            scene.forEach(surface =>
                surface.edges.forEach(edge => {
                    const point1 = surface.points[edge.p1];
                    const point2 = surface.points[edge.p2];
                    graph.line(
                        getProection(point1).x, getProection(point1).y,
                        getProection(point2).x, getProection(point2).y
                    );
                })
            );
        }
        graph.renderFrame();
    }

    useEffect(() => {
        graph = getGraph({
            id: 'canvasGraph3D',
            width: 600,
            height: 600,
            WIN: WIN,
            callbacks: {
                wheel,
                mousemove,
                mouseup,
                mousedown,
            }
        });
        let interval = setInterval(() => {
            scene.forEach(surface => surface.doAnimation(math3D));
        }, 50)
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

            calcPlaneEquation();
            calcWindowVectors();
            renderScene(FPS);
            requestAnimationFrame(renderLoop);
        }

        renderLoop()
        return () => {
            window.cancelAnimationFrame(renderLoop);
            clearInterval(interval);
            graph = null;
        }
    })

    return (<div><canvas id='canvasGraph3D' className='asg'></canvas>
        <div>
            <select id='selectFigure'>
                <option value='ellipticCylinder'>Эллиптический цилиндр</option>
                <option value='ellipticParaboloid'>Эллиптический параболоид</option>
                <option value='hyperbolicParaboloid'>Принглс??????</option>
                <option value='twoSurfaceHyperboloid'>Двуполостный гиперболоид</option>
                <option value='oneSurfaceHyperboloid'>Однополостный гиперболоид</option>
                <option value='hyperbolicCylinder'>Гиперболический цилиндр</option>
                <option value='kleinBottle'>Бутылка клейна</option>
                <option value='sphere'>Сфера</option>
                <option value='ellipse'>Эллипс</option>
                <option value='thor'>Тор (бублик)</option>
                <option value='cube'>Куб</option>
            </select>
        </div>
        <div>
            <label htmlFor="points">Рисовать точки</label>
            <input className='customSurface' data-custom='drawPoints' type='checkbox' value='points' defaultChecked></input>
            <label htmlFor="edges">Рисовать рёбра</label>
            <input className='customSurface' data-custom='drawEdges' type='checkbox' value='edges' defaultChecked></input>
            <label htmlFor="polygons">Рисовать полигоны</label>
            <input className='customSurface' data-custom='drawPolygons' type='checkbox' value='polygons' defaultChecked></input>
        </div>
        <div id='paramsBlock'>
            <div id='cube params'></div>
        </div>
    </div>)
}

export default Graph3D;