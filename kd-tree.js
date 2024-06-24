class KDNode {
    constructor(point, axis, left = null, right = null) {
        this.point = point;
        this.axis = axis;
        this.left = left;
        this.right = right;
    }
}

function insertKDTree(node, point, depth = 0) {
    if (node === null) {
        return new KDNode(point, depth % 2);
    }

    const axis = node.axis;
    if (point[axis] < node.point[axis]) {
        node.left = insertKDTree(node.left, point, depth + 1);
    } else {
        node.right = insertKDTree(node.right, point, depth + 1);
    }

    return node;
}

function distanceSquared(point1, point2) {
    return (point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2;
}

function nearestNeighbor(node, target, depth = 0, best = null) {
    if (node === null) {
        return best;
    }

    const axis = depth % 2;
    const nextBest = best === null || distanceSquared(target, node.point) <
        distanceSquared(target, best.point) ? node : best;
    const nextDepth = depth + 1;
    let nextNode = null;
    let oppositeNode = null;
    if (target[axis] < node.point[axis]) {
        nextNode = node.left;
        oppositeNode = node.right;
    } else {
        nextNode = node.right;
        oppositeNode = node.left;
    }
    best = nearestNeighbor(nextNode, target, nextDepth, nextBest);
    if (distanceSquared(target, best.point) > (target[axis] - node.point[axis]) ** 2) {
        best = nearestNeighbor(oppositeNode, target, nextDepth, best);
    }
    return best;
}

function kNearestNeighbors(node, target, k, depth = 0, heap = []) {
    if (node === null) {
        return heap;
    }

    const axis = node.axis;
    const distance = distanceSquared(target, node.point);
    if (heap.length < k) {
        heap.push({ node: node, distance: distance });
        heap.sort((a, b) => a.distance - b.distance);
    } else if (distance < heap[heap.length - 1].distance) {
        heap[heap.length - 1] = { node: node, distance: distance };
        heap.sort((a, b) => a.distance - b.distance);
    }

    const nextNode = target[axis] < node.point[axis] ? node.left : node.right;
    const oppositeNode = target[axis] < node.point[axis] ? node.right : node.left;

    heap = kNearestNeighbors(nextNode, target, k, depth + 1, heap);
    if (heap.length < k || Math.abs(target[axis] - node.point[axis]) ** 2 < heap[heap.length - 1].distance) {
        heap = kNearestNeighbors(oppositeNode, target, k, depth + 1, heap);
    }

    return heap;
}

function findMin(node, d, depth = 0) {
    if (node === null) {
        return null;
    }

    const axis = depth % 2;

    if (axis === d) {
        if (node.left === null) {
            return node;
        }
        return findMin(node.left, d, depth + 1);
    }

    return minNode(node,
        findMin(node.left, d, depth + 1),
        findMin(node.right, d, depth + 1), d);
}

function minNode(x, y, z, d) {
    let res = x;
    if (y !== null && y.point[d] < res.point[d]) {
        res = y;
    }
    if (z !== null && z.point[d] < res.point[d]) {
        res = z;
    }
    return res;
}

function deleteNode(node, point, depth = 0) {
    if (node === null) {
        return null;
    }

    const axis = depth % 2;

    if (arraysEqual(node.point, point)) {
        if (node.right !== null) {
            const min = findMin(node.right, axis, depth + 1);
            node.point = min.point;
            node.right = deleteNode(node.right, min.point, depth + 1);
        } else if (node.left !== null) {
            const min = findMin(node.left, axis, depth + 1);
            node.point = min.point;
            node.right = deleteNode(node.left, min.point, depth + 1);
            node.left = null;
        } else {
            return null;
        }
    } else if (point[axis] < node.point[axis]) {
        node.left = deleteNode(node.left, point, depth + 1);
    } else {
        node.right = deleteNode(node.right, point, depth + 1);
    }

    return node;
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}
