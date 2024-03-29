const sortByName = (list) => {
  const sortedArr = list.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  return sortedArr;
};

const sortByTime = (list) => {
  const sortedArr = list.sort((a, b) => {
    if (Number(a.updatedAt) > Number(b.updatedAt)) {
      return -1;
    }
    if (Number(a.updatedAt) < Number(b.updatedAt)) {
      return 1;
    }
    return 0;
  });
  return sortedArr;
};

module.exports = { sortByName, sortByTime };
