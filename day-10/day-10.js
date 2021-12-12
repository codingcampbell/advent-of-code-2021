const input = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length);

const openChars = ['(', '[', '{', '<'];

const closeChars = [')', ']', '}', '>'];

const openToCloseChar = new Map([
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
]);

const charScores = new Map([
  [')', 3],
  [']', 57],
  ['}', 1197],
  ['>', 25137],
]);

const autocompleteScores = new Map([
  [')', 1],
  [']', 2],
  ['}', 3],
  ['>', 4],
]);

const getLineScore = line => {
  const chars = [...line];
  const expectedClose = [];

  while (chars.length) {
    const c = chars.shift();
    if (openChars.includes(c)) {
      expectedClose.unshift(openToCloseChar.get(c) || '?');
    } else if (closeChars.includes(c)) {
      if (c !== expectedClose[0]) {
        return { score: charScores.get(c) || 0, expectedClose };
      }

      expectedClose.shift();
    }
  }

  return { score: 0, expectedClose };
};

const part1 = () => input
  .map(getLineScore)
  .filter(({ score }) => score > 0)
  .reduce((a, b) => a + b.score, 0);

const part2 = () => {
  const scores = input
    .map(getLineScore)
    .filter(({ score }) => score === 0)
    .map(({ expectedClose }) => expectedClose
      .reduce((a, b) => a * 5 + (autocompleteScores.get(b) || 0), 0)
    )
    .sort((a, b) => a < b ? -1 : 1);

  return scores[Math.floor(scores.length / 2)];
};


console.log('Part 1:', part1());
console.log('Part 2:', part2());
