class Edge {
    p1: number;
    p2: number;
    color: string;

    constructor (p1 = 0, p2 = 0, color='#000000') {
        this.p1 = p1;
        this.p2 = p2;
        this.color = color
    }
}

export default Edge;