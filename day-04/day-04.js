const input = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length)

const draws = input.shift().split(/,/).map(x => +x);
const boards = [];

class Board {
  constructor(lines) {
    this.spaces = lines.map(line => line.split(/\s+/).filter(x => x.trim().length).map(x => +x));
    this.marked = this.spaces.map(row => row.map(() => false));
    this.columns = this.spaces[0].length;
    this.rows = this.spaces.length;
    this.won = false;
    this.score = 0;
  }

  checkWon() {
    const rowWin = this.marked.some(row => row.every(v => v === true));
    if (rowWin) {
      this.won = true;
      this.score = this.getScore();
      return true;
    }

    const colWin = this.marked[0].some((_, column) =>
      this.marked.every(row => row[column] === true)
    );

    if (colWin) {
      this.won = true;
      this.score = this.getScore();
      return true;
    }

    return false;
  }

  getScore() {
    return this.spaces.map((row, rowIndex) => row
      .map((value, colIndex) => value * +!this.marked[rowIndex][colIndex])
      .reduce((a, b) => a + b, 0)
    ).reduce((a, b) => a + b, 0);
  }

  draw(number) {
    let marked = false;

    this.spaces.forEach((row, rowIndex) => row.forEach((value, column) => {
      if (value === number) {
        this.marked[rowIndex][column] = true;
        marked = true;
      }
    }));

    if (marked) {
      this.checkWon();
    }
  }
}

while (input.length >= 5) {
  boards.push(new Board(input.splice(0, 5)));
}

const part1 = () => {
  const numbers = draws.slice();
  let draw = 0;
  let winningBoards = [];

  while (numbers.length && !winningBoards.length) {
    draw = numbers.shift();
    boards.forEach(board => board.draw(draw));
    winningBoards = boards.filter(board => board.won);
  }

  winningBoards.sort((a, b) => a.score < b.score ? 1 : -1);
  return winningBoards[0].score * draw;
};

const part2 = () => {
  const numbers = draws.slice();
  let draw = 0;
  let winningBoards = [];

  while (numbers.length && winningBoards.length < boards.length - 1) {
    draw = numbers.shift();
    boards.forEach(board => board.draw(draw));
    winningBoards = boards.filter(board => board.won);
  }

  const lastWinningBoard = boards.find(board => !board.won);

  while (numbers.length && !lastWinningBoard.won) {
    draw = numbers.shift();
    lastWinningBoard.draw(draw);
  }

  return lastWinningBoard.score * draw;
};

console.log('Part 1:', part1());
console.log('Part 2:', part2());
