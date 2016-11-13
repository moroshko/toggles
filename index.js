const combinations = require('./combinations');

const board = {
  diagram: `
    1--2--3
    |  |  |
    4--5--6
   / \/ \/ \
  7--8--9--10
  `,
  connections: {
    1: [1, 2, 4],
    2: [1, 2, 3, 5],
    3: [2, 3, 6],
    4: [1, 4, 5, 7, 8],
    5: [2, 4, 5, 6, 8, 9],
    6: [3, 5, 6, 9, 10],
    7: [4, 7, 8],
    8: [4, 5, 7, 8, 9],
    9: [5, 6, 8, 9, 10],
    10: [6, 9, 10]
  }
};

const isBoardValid = board =>
  Object.keys(board.connections).every(id => board.connections[id].indexOf(+id) > -1);

const getInitialPosition = board =>
  Object.keys(board.connections).reduce((result, id) => {
    result[id] = false;
    return result;
  }, {});

const replaceLine = (line, position) =>
  Object.keys(position).reduce((result, id) =>
    result.replace(new RegExp(`\\b${id}\\b`), position[id] ? 'X' : 'O')
  , line);

const printPosition = position =>
  board.diagram.trim().split('\n').forEach(line => {
    console.log(replaceLine(line.trim(), position));
  });

const toggle = (position, id) => {
  position[id] = !position[id];
  return position;
};

const makeMoves = (position, moves) =>
  moves.reduce((result, move) =>
    board.connections[move].reduce(toggle, result)
  , Object.assign({}, position));

const isSolution = position =>
  Object.keys(position).every(id => position[id] === true);

if (isBoardValid(board)) {
  const initialPosition = getInitialPosition(board);
  const potentialSolutions = combinations(Object.keys(initialPosition));
  const correctSolutions = potentialSolutions.filter(potentialSolution =>
    isSolution(makeMoves(initialPosition, potentialSolution))
  );

  if (correctSolutions.length === 0) {
    console.log('No solutions!');
  } else {
    correctSolutions.forEach(solution => console.log(solution));
  }
} else {
  console.error('Invalid board :(');
}
