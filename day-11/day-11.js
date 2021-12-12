const input = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length)
  .map(line => [...line].map(x => +x));

const debug = state => {
  return '\n' + state.map(line => line.join('')).join('\n');
}

const getAdjacent = (x, y) => {
  const cells = [];

  if (x > 0) {
    cells.push([x - 1, y]);

    if (y > 0) { cells.push([x - 1, y - 1]); }
    if (y < 9) { cells.push([x - 1, y + 1]); }
  }

  if (x < 9) {
    cells.push([x + 1, y]);

    if (y > 0) { cells.push([x + 1, y - 1]); }
    if (y < 9) { cells.push([x + 1, y + 1]); }
  }

  if (y > 0) { cells.push([x, y - 1]); }
  if (y < 9) { cells.push([x, y + 1]); }

  return cells;
};

const step = state => {
  const result = state.map(row => row.map(x => x + 1));

  const flashes = [];
  let flashCount = 0;

  for (let y = 0; y < 10; y += 1) {
    for (let x = 0; x < 10; x += 1) {
      if (result[y][x] > 9) {
        result[y][x] = 0;
        flashes.push([x, y]);
        flashCount += 1;
      }
    }
  }

  while (flashes.length) {
    getAdjacent(...flashes.shift()).forEach(([x, y]) => {
      if (result[y][x] !== 0) {
        result[y][x] += 1;

        if (result[y][x] > 9) {
          result[y][x] = 0;
          flashes.push([x ,y]);
          flashCount += 1;
        }
      }
    });
  }

  return [result, flashCount];
};

const part1 = () => {
  let state = input.slice();
  let flashCount = 0;
  for (let j = 0; j < 100; j += 1) {
    const result = step(state);
    state = result[0];
    flashCount += result[1];
  }

  return flashCount;
};

const part2 = () => {
  let count = 0;
  let state = input.slice();
  while (!state.flat().every(x => x === 0)) {
    count += 1;
    state = step(state)[0];
  }

  return count;
};

console.log('Part 1:', part1());
console.log('Part 2:', part2());
