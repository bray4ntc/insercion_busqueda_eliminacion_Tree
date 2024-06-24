const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let kdTree = null;
let points = [];

function drawPoint(point, color = 'black') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point[0], point[1], 5, 0, 2 * Math.PI);
    ctx.fill();
}

function drawLine(point1, point2, color = 'blue') {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(point1[0], point1[1]);
    ctx.lineTo(point2[0], point2[1]);
    ctx.stroke();
}

function drawKDTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach(point => drawPoint(point));
}

function insertRandomPoint() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const point = [x, y];
    points.push(point);
    kdTree = insertKDTree(kdTree, point);
    drawKDTree();
}

function findNearest() {
    if (points.length === 0) {
        alert("No points in the KD-Tree.");
        return;
    }
    const queryPoint = [Math.random() * canvas.width, Math.random() * canvas.height];
    const nearest = nearestNeighbor(kdTree, queryPoint);
    drawKDTree();
    drawPoint(queryPoint, 'red');
    drawPoint(nearest.point, 'green');
    drawLine(queryPoint, nearest.point, 'red');
}

function deletePoint() {
    if (points.length === 0) {
        alert("No points in the KD-Tree.");
        return;
    }
    const pointToDelete = points.pop();
    kdTree = deleteNode(kdTree, pointToDelete);
    drawKDTree();
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const point = [x, y];
    points.push(point);
    kdTree = insertKDTree(kdTree, point);
    drawKDTree();
});

document.getElementById('k').addEventListener('input', (event) => {
    const k = parseInt(event.target.value);
    if (!isNaN(k)) {
        if (points.length === 0) {
            alert("No points in the KD-Tree.");
            return;
        }
        const queryPoint = [Math.random() * canvas.width, Math.random() * canvas.height];
        const kNearest = kNearestNeighbors(kdTree, queryPoint, k);
        drawKDTree();
        drawPoint(queryPoint, 'red');
        kNearest.forEach(result => {
            drawPoint(result.node.point, 'green');
            drawLine(queryPoint, result.node.point, 'green');
        });
    }
});
