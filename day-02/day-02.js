const instructions = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length)
  .map(line => {
    const [instruction, amount] = line.split(/\s+/);
    return [instruction, +amount];
  })

const shared = commands => {
  const pos = { x: 0, y: 0, aim: 0 };
  instructions.forEach(([instruction, amount]) => commands[instruction](pos, amount));
  return pos.x * pos.y;
};

const part1 = () => shared({
  forward: (pos, n) => pos.x += n, 
  down: (pos, n) => pos.y += n,
  up: (pos, n) => pos.y -= n,
});

const part2 = () => shared({
  forward: (pos, n) => { pos.x += n; pos.y += pos.aim * n; },
  down: (pos, n) => pos.aim += n,
  up: (pos, n) => pos.aim -= n,
});

console.log('Part 1:', part1());
console.log('Part 2:', part2());
