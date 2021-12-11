const input = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length)
  .map(line => line
    .split(/\s+->\s+/)
    .map(x => x.split(/,/).map(x => +x))
    .reduce((a, b) => [...a, ...b], [])
  );

const plot = (grid, x1, y1, x2, y2) => {
  if (x1 === x2) {
    const yy1 = Math.min(y1, y2);
    const yy2 = Math.max(y1, y2);

    for (let y = yy1; y <= yy2; y += 1) {
      grid[y][x1] += 1;
    }

    return true;
  }

  if (y1 === y2) {
    const xx1 = Math.min(x1, x2);
    const xx2 = Math.max(x1, x2);

    for (let x = xx1; x <= xx2; x += 1) {
      grid[y1][x] += 1;
    }

    return true;
  }

  return false;
};

const plotDiagonal = (grid, x1, y1, x2, y2) => {
  if (plot(grid, x1, y1, x2, y2)) {
    return;
  }

  const minDist = Math.min(Math.abs(x1 - x2), Math.abs(y1 - y2));
  const vx = x1 < x2 ? 1 : -1;
  const vy = y1 < y2 ? 1 : -1;
  for (let j = 0;j <= minDist; j += 1) {
    grid[y1 + vy * j][x1 + vx * j] += 1;
  }
}

const countIntersections = grid => grid.map(row => row.filter(x => x >= 2).length).reduce((a, b) => a + b, 0);

let maxX = 1;
let maxY = 1;
const lines = input.map(([x1, y1, x2, y2]) => {
  maxX = Math.max(maxX, x1, x2);
  maxY = Math.max(maxY, y1, y2);
  return [x1, y1, x2, y2];
});
const grid = Array.from(Array(maxY + 1)).map(() => Array.from(Array(maxX + 1)).map(() => 0));

const part1 = () => {
  const resultGrid = grid.slice().map(row => row.slice());
  lines.forEach(line => plot(...[resultGrid, ...line]));

  return countIntersections(resultGrid);
};

const part2 = () => {
  const resultGrid = grid.slice().map(row => row.slice());
  lines.forEach(line => plotDiagonal(...[resultGrid, ...line]));

  return countIntersections(resultGrid);
};

console.log('Part 1:', part1());
console.log('Part 2:', part2());
