class Point {
    x: number;
    y: number;
    z: number | 0;

    constructor (x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

export default Point;