const input = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length)
  .map(line => line
    .split(/\s+->\s+/)
    .map(x => x.split(/,/).map(x => +x))
    .reduce((a, b) => [...a, ...b], [])
  );

class Line {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  plot(grid, allowDiagonal) {
    if (this.x1 === this.x2) {
      const y1 = Math.min(this.y1, this.y2);
      const y2 = Math.max(this.y1, this.y2);

      for (let y = y1; y <= y2; y += 1) {
        grid[y][this.x1] += 1;
      }
    } else if (this.y1 === this.y2) {
      const x1 = Math.min(this.x1, this.x2);
      const x2 = Math.max(this.x1, this.x2);

      for (let x = x1; x <= x2; x += 1) {
        grid[this.y1][x] += 1;
      }
    } else if (allowDiagonal) {
      const minDist = Math.min(Math.abs(this.x1 - this.x2), Math.abs(this.y1 - this.y2));
      const vx = this.x1 < this.x2 ? 1 : -1;
      const vy = this.y1 < this.y2 ? 1 : -1;
      for (let j = 0;j <= minDist; j += 1) {
        grid[this.y1 + vy * j][this.x1 + vx * j] += 1;
      }
    }
  }
}

let maxX = 1;
let maxY = 1;
const lines = input.map(([x1, y1, x2, y2]) => {
  maxX = Math.max(maxX, x1, x2);
  maxY = Math.max(maxY, y1, y2);
  return new Line(x1, y1, x2, y2);
});

const part1 = () => {
  const grid = Array.from(Array(maxY + 1)).map(() => Array.from(Array(maxX + 1)).map(() => 0));
  lines.forEach(line => line.plot(grid, false));

  return grid.map(row => row.filter(x => x >= 2).length).reduce((a, b) => a + b, 0);
};

const part2 = () => {
  const grid = Array.from(Array(maxY + 1)).map(() => Array.from(Array(maxX + 1)).map(() => 0));
  lines.forEach(line => line.plot(grid, true));

  return grid.map(row => row.filter(x => x >= 2).length).reduce((a, b) => a + b, 0);
};

console.log('Part 1:', part1());
console.log('Part 2:', part2());
