const getInitialPointers = size => {
  let result = [];

  for (let i = 0; i < size; i++) {
    result[i] = i;
  }

  return result;
};

//    array = [1, 2, 3, 4]
// pointers = [0, 1, 2]
//   result = [1, 2, 3]
const combinationByPointers = (array, pointers) =>
  pointers.reduce((result, pointer) => result.concat([array[pointer]]), []);

// pointers = [0, 1, 2]
//      max = 3
//   result = [0, 1, 3]
//
// pointers = [1, 2, 3]
//      max = 3
//   result = null
const incrementPointers = (pointers, max) => {
  let result = [], len = pointers.length - 1;

  for (let i = len; i >= 0; i--) {
    if (pointers[i] === max || (i < len && pointers[i] + 1 === pointers[i + 1])) {
      result.unshift(pointers[i]);
    } else {
      result = pointers.slice(0, i).concat(pointers[i] + 1);

      while (result.length <= len) {
        result.push(result[result.length - 1] + 1);
      }

      return result;
    }
  }

  return null;
};

const combinationsOfSize = (array, size) => {
  let result = [];
  let pointers = getInitialPointers(size);
  const maxPointer = array.length - 1;

  do {
    result.push(combinationByPointers(array, pointers));
    pointers = incrementPointers(pointers, maxPointer);
  } while (pointers !== null);

  return result;
};

export default array => {
  let result = [];

  for (let size = 0, len = array.length; size <= len; size++) {
    result = result.concat(combinationsOfSize(array, size));
  }

  return result;
};
