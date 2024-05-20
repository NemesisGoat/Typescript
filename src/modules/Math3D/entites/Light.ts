import Point from "./Point";

class Light extends Point {
    lumen: number;

    constructor(x: number, y: number, z: number, lumen = 1000) {
        super(x, y, z);
        this.lumen = lumen;
    }
}

export default Light;