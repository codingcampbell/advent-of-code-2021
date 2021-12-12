const input = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length)
  .map(row => [...row].map(x => +x));

const matrix = {
  data: input,
  width: input[0].length,
  height: input.length,
};

const getAdjacent = (matrix, x, y) => {
  const cells = [];

  if (x > 0) { cells.push([x - 1, y]); }
  if (y > 0) { cells.push([x, y - 1]); }
  if (x < matrix.width - 1) { cells.push([x + 1, y]); }
  if (y < matrix.height - 1) { cells.push([x, y + 1]); }

  return cells.map(([x, y]) => ({ x, y, value: matrix.data[y][x] }));
};

const findLowPoints = matrix => {
  const lowPoints = [];

  for (let y = 0; y < matrix.height; y += 1) {
    for (let x = 0; x < matrix.width; x += 1) {
      const points = getAdjacent(matrix, x, y).map(({ value }) => value);

      if (matrix.data[y][x] < Math.min(...points)) {
        lowPoints.push({ x, y, value: matrix.data[y][x] });
      }
    }
  }

  return lowPoints;
};

const measureBasin = (matrix, x, y) => {
  const visited = [];
  const basin = [];
  const cells = [{ x, y, value: matrix.data[y][x] }];

  while (cells.length) {
    const cell = cells.shift();

    if (visited.indexOf(cell.y * matrix.width + cell.x) !== -1) {
      continue;
    }

    visited.push(cell.y * matrix.width + cell.x);
    basin.push(cell);
    cells.push(...getAdjacent(matrix, cell.x, cell.y).filter(c => c.value < 9));
  }

  return basin;
};

const part1 = () => findLowPoints(matrix).reduce((a, b) => a + b.value + 1, 0);

const part2 = () => findLowPoints(matrix)
  .map(({ x, y }) => measureBasin(matrix, x, y).length)
  .sort((a, b) => a < b ? 1 : -1)
  .slice(0, 3)
  .reduce((a, b) => a * b, 1);

console.log('Part 1:', part1());
console.log('Part 2:', part2());
