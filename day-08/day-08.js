const input = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length)
  .map(line => line
    .split(/\s+\|\s+/)
    .map(x => x.split(/\s+/))
  )

const segmentMatchCount = (a, b) => [...a].filter(x => b.indexOf(x) !== -1).length;

const identifyNumber = segmentList => {
  const len = segmentList.length;
  if (len === 2) { return 1; }
  if (len === 3) { return 7; }
  if (len === 4) { return 4; }
  if (len === 7) { return 8; }
  return -1;
};

const deduceNumbers = segments => {
  const knownNumbers = Array.from(Array(10));
  let examples = segments.filter(segmentList => {
    const num = identifyNumber(segmentList)
    if (num !== -1) {
      knownNumbers[num] = segmentList;
      return false;
    }

    return true;
  });

  // We can find "3" by inspecting all 5-length segments and filtering on the one that has same segments as "1"
  examples = examples.filter(segmentList => {
    if (segmentList.length !== 5) {
      return true;
    }

    const match = [...segmentList].sort().join('').indexOf([...knownNumbers[1]].sort().join('')) !== -1;

    if (segmentMatchCount(segmentList, knownNumbers[1]) === 2) {
      knownNumbers[3] = segmentList;
      return false;
    }

    return true;
  });

  const fiveSegment = examples
    .filter(segmentList => segmentList.length === 5)
    // Sort by segment match score against 4 (ascending) to identify the remaining 5-length segments
    .sort((a, b) => segmentMatchCount(a, knownNumbers[4]) < segmentMatchCount(b, knownNumbers[4]) ? -1 : 1);

  // 2 is the 5-length segment left that matches the least with 4
  knownNumbers[2] = fiveSegment[0];

  // 5 is last remaining 5-length segment
  knownNumbers[5] = fiveSegment[1];

  let sixSegment = examples
    .filter(ex => ex.length === 6)
    .sort((a, b) => segmentMatchCount(a, knownNumbers[3]) < segmentMatchCount(b, knownNumbers[3]) ? 1 : -1)

  // 9 has the most segment matches with 3
  knownNumbers[9] = sixSegment.shift();

  sixSegment.sort((a, b) => segmentMatchCount(a, knownNumbers[5]) < segmentMatchCount(b, knownNumbers[5]) ? 1 : -1)

  // 6 has the most segment matches with 5
  knownNumbers[6] = sixSegment.shift();

  // 0 is the last number
  knownNumbers[0] = sixSegment[0];
  return knownNumbers;
};

const part1 = () => {
  return input
    .map(([_, segments]) => segments.filter(s => identifyNumber(s) !== -1).length)
    .reduce((a, b) => a + b, 0);
};

const part2 = () => {
  return input.map(([samples, digits]) => {
    const numbers = deduceNumbers(samples).map(n => [...n].sort().join(''));
    return +digits.map(x => numbers.indexOf([...x].sort().join(''))).join('');
  }).reduce((a, b) => a + b, 0);
};

console.log('Part 1:', part1());
console.log('Part 2:', part2());
