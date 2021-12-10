const readings = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .map(x => x.trim())
  .filter(x => x.length)
  .map(x => +x)
  .filter(x => !isNaN(x));

const part1 = (readings) => {
  let lastReading = null;
  let incrementCount = 0;
  readings.forEach(reading => {
    if (lastReading !== null && reading > lastReading) {
      incrementCount += 1;
    }

    lastReading = reading;
  });

  return incrementCount;
};

const part2 = () => {
  const windows = [];
  for (let j = 0; j + 3 <= readings.length; j += 1) {
    windows.push(readings.slice(j, j + 3).reduce((a, b) => a + b, 0));
  }

  return part1(windows);
};

console.log('Part 1:', part1(readings));
console.log('Part 2:', part2());
