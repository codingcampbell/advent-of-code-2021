const numbers = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length)
  .map(x => [...x].map(x => +x))

const toDecimal = bitArray => bitArray.reverse().reduce((a, b, index) => a + b * Math.pow(2, index));

const getColumn = (bitMatrix, column) => bitMatrix.map(row => row[column]);

const mostCommonBit = (equalityValue, bitArray) => {
  const count = [0, 0];
  bitArray.forEach(x => count[x] += 1);
  return (count[0] === count[1]) ? equalityValue : +(count[1] > count[0]);
};

const leastCommonBit = (equalityValue, bitArray) => {
  const count = [0, 0];
  bitArray.forEach(x => count[x] += 1);
  return (count[0] === count[1]) ? equalityValue : +(count[0] > count[1]);
};

const bitFilter = (numbers, criteria) => {
  let haystack = numbers.slice();
  const bitcount = numbers[0].length;
  for (let j = 0; j < bitcount && haystack.length > 1; j += 1) {
    const criteriaValue = criteria(getColumn(haystack, j));
    haystack = haystack.filter(bits => bits[j] === criteriaValue);
  }

  return haystack[0];
};

const part1 = () => {
  const gamma = numbers[0].map((_, i) => mostCommonBit(0, getColumn(numbers, i)));
  const epsilon = numbers[0].map((_, i) => leastCommonBit(0, getColumn(numbers, i)));
 
  return toDecimal(gamma) * toDecimal(epsilon);
};

const part2 = () => {
  const oxygenRating = bitFilter(numbers, mostCommonBit.bind(null, 1));
  const co2scrubber = bitFilter(numbers, leastCommonBit.bind(null, 0));

  return toDecimal(oxygenRating) * toDecimal(co2scrubber);
};

console.log('Part 1:', part1());
console.log('Part 2:', part2());
