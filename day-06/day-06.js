const input = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length)
  .map(line => line.split(/,/).map(x => +x))
  .reduce((a, b) => [...a, ...b], [])

const fishCycles = Array.from(Array(9)).map(() => 0);
input.forEach(n => fishCycles[n] += 1);

const processFish = (cycles, days) => {
  for (let j = 0; j < days; j += 1) {
    cycles.push(cycles.shift());
    cycles[6] += cycles[8];
  }

  return cycles.reduce((a, b) => a + b, 0);
}
const part1 = () => {
  return processFish(fishCycles.slice(), 80);
};

const part2 = () => {
  return processFish(fishCycles.slice(), 256);
};

console.log('Part 1:', part1());
console.log('Part 2:', part2());
