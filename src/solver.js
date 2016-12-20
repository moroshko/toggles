import combinations from './combinations';

const toggle = (position, id) => {
  position[id] = !position[id];
  return position;
};

const makeMoves = (position, connections, moves) =>
  moves.reduce((result, move) =>
    connections[move].reduce(toggle, result)
  , { ...position });

const isSolution = position =>
  Object.keys(position).every(id => position[id] === true);

const splitLineKey = lineKey => lineKey.split(' - ');

// position = {
//   '0,1': false,
//   '0,3': false,
//   '0,5': false,
//   '2,1': false,
//   '2,3': false,
//   '2,5': false
// }
// lines = {
//   '0,1 - 0,3': true,
//   '0,3 - 0,5': true,
//   '0,1 - 2,1': true,
//   '0,3 - 2,3': true,
//   '0,5 - 2,5': true,
//   '2,1 - 2,3': true,
//   '2,3 - 2,5': true
// }
const getConnections = (position, lines) => {
  // linesArr = [
  //   ['0,1', '0,3'],
  //   ['0,3', '0,5'],
  //   ['0,1', '2,1'],
  //   ...
  // ]
  const linesArr = Object.keys(lines).map(splitLineKey);

  return Object.keys(position).reduce((result, toggleKey) => {
    const connectionsHash = linesArr.reduce((hash, item) => {
      if (item[0] === toggleKey) {
        hash[item[1]] = true;
      } else if (item[1] === toggleKey) {
        hash[item[0]] = true;
      };

      return hash;
    }, { [toggleKey]: true });

    result[toggleKey] = Object.keys(connectionsHash);

    return result;
  }, {});
};

const getMemoKey = (position, lines) => {
  const positionMemo = Object.keys(position).reduce((result, toggleKey) => {
    return `${result}${toggleKey}_${position[toggleKey] ? '1' : '0'}|`;
  }, '');
  const linesMemo = Object.keys(lines).reduce((result, lineKey) => {
    return `${result}${lineKey}|`;
  }, '');

  return `${positionMemo}|${linesMemo}`;
};

let memo = {};

// position = {
//   '0,1': false,
//   '0,3': false,
//   '0,5': false,
//   '2,1': false,
//   '2,3': false,
//   '2,5': false
// }
// connections = {
//   '0,1': ['0,1', '0,3', '2,1'],
//   '0,3': ['0,1', '0,3', '0,5', '2,3'],
//   '0,5': ['0,3', '0,5', '2,5'],
//   '2,1': ['0,1', '2,1', '2,3'],
//   '2,3': ['0,3', '2,1', '2,3', '2,5'],
//   '2,5': ['0,5', '2,3', '2,5']
// }
export default (position, lines) => {
  const memoKey = getMemoKey(position, lines);

  if (memo[memoKey]) {
    return memo[memoKey];
  }

  const connections = getConnections(position, lines);
  const potentialSolutions = combinations(Object.keys(position));
  let solution = null;

  for (let i = 0, len = potentialSolutions.length; i < len; i++) {
    if (isSolution(makeMoves(position, connections, potentialSolutions[i]))) {
      solution = potentialSolutions[i];
      break;
    }
  }

  memo[memoKey] = solution;

  return solution;
};
