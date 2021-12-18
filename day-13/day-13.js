const input = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length)
  .map(line => line.split(/,/));

const coords = input
  .filter(line => line.length === 2)
  .map(([x, y]) => [+x, +y]);

const folds = input
  .filter(line => line.length === 1)
  .map(([line]) => {
    const match = line.match(/([xy])=(\d+)$/);
    return {
      horizontal: match[1] === 'y',
      value: +match[2],
    };
  });

const buildGrid = coords => {
  let maxX = 0;
  let maxY = 0;

  coords.forEach(([x, y]) => {
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });

  const grid = Array.from(Array(maxY + 1)).map(row => Array.from(Array(maxX + 1)).map(() => 0));

  coords.forEach(([x, y]) => {
    grid[y][x] = 1;
  });

  return grid;
};

const printGrid = grid => '\n' + grid.map(row => row.map(x => x ? '#' : '.').join('')).join('\n');

const foldHorizontal = (grid, foldY) => {
  const bottom = grid.slice(foldY + 1).reverse();
  return grid.slice(0, foldY).map((row, rowY) => row.map((v, col) => v + bottom[rowY][col]));
};

const foldVertical = (grid, foldX) => grid.map(row => {
  const right = [...row.slice(foldX + 1), ...Array.from(Array(foldX)).map(() => 0)].slice(0, foldX);
  right.reverse();
  return row.slice(0, foldX).map((v, i) => v + right[i]);
});

const part1 = () => {
  const folder = folds[0].horizontal ? foldHorizontal : foldVertical;
  const grid = folder(buildGrid(coords), folds[0].value);
  return grid.map(row => row.reduce((a, b) => a + (b && 1 || 0), 0)).reduce((a, b) => a + b, 0);
};

const part2 = () => {
  let grid = buildGrid(coords);
  folds.forEach(f => grid = f.horizontal ? foldHorizontal(grid, f.value) : foldVertical(grid, f.value));
  return printGrid(grid);
};

console.log('Part 1:', part1());
console.log('Part 2:', part2());
