const input = require('fs').readFileSync(0).toString()
  .split(/\r?\n/)
  .filter(x => x.trim().length)
  .map(line => line.split(/-/));

const nodes = new Map();

input.forEach(([from, to]) => {
  nodes.set(from, [...(nodes.get(from) || []), to]);
  nodes.set(to, [...(nodes.get(to) || []), from]);
});

const walk = (allowScenic, nodes, nodeKey, path = [], endingPaths = []) => {
  const p = [...path, nodeKey];

  const visitedSmallCave = !allowScenic ? true : p.some(cave => {
    if (cave === 'start' || cave === 'end' || cave.toUpperCase() === cave) {
      return false;
    }

    return p.filter(c => cave === c).length > 1;
  });

  const paths = nodes
    .get(nodeKey)
    .filter(leaf => {
      // Don't go through starting cave again
      if (leaf === 'start') {
        return false;
      }

      // Don't keep walking past the end cave
      if (leaf === 'end') {
        endingPaths.push([...p, 'end']);
        return false;
      }

      // Don't allow lowercase caves to have multiple visits
      if (visitedSmallCave && leaf === leaf.toLowerCase() && p.indexOf(leaf) !== -1) {
        return false;
      }

      return true;
    });

  paths.forEach(leaf => walk(allowScenic, nodes, leaf, p, endingPaths));

  return endingPaths;
};

const part1 = () => walk(false, nodes, 'start').length;

const part2 = () => walk(true, nodes, 'start').length;

console.log('Part 1:', part1());
console.log('Part 2:', part2());
