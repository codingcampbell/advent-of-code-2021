const input = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length)
  .map(line => line.split(/,/).map(x => +x))
  .reduce((a, b) => [...a, ...b], []);

const crabbyEstimator = (from, to) => {
  let dist = Math.abs(to - from);
  let cost = 0;
  while (dist >= 0) {
    cost += dist;
    dist -= 1;
  }

  return cost;
};

const linearEstimator = (from, to) => Math.abs(to - from);

const shared = (positions, estimator) => {
  const pos = positions.slice();
  const max = Math.max(...pos);

  return Array.from(Array(max))
    .map((_, i) => [i, pos.map(p => estimator(p, i)).reduce((a, b) => a + b, 0)])
    .sort((a, b) => a[1] < b[1] ? -1 : 1)[0][1];
};

const part1 = () => {
  return shared(input.slice(), linearEstimator);
};


const part2 = () => {
  return shared(input.slice(), crabbyEstimator);
};

console.log('Part 1:', part1());
console.log('Part 2:', part2());
