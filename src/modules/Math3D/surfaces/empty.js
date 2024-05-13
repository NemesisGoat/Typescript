Surfaces.prototype.empty = () => {
    const points = [];
    const edges  = [];
    const polygons = [];
    
    return new Surface(points, edges, polygons);
} 