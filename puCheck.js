const { readFile } = require('fs/promises');

async function readFullDataFile() {
  const fileContents = await readFile('./cleanedData.json', 'utf-8');
  return JSON.parse(fileContents);
}

let puCountAccumulator = 0;
let wardCountAccumulator = 0;
const puCounts = [];
function checkPuCount(data) {
  Object.keys(data).forEach((state) => {
    Object.keys(data[state]).forEach((lga) => {
      Object.keys(data[state][lga]).forEach((ward) => {
        wardCountAccumulator += 1;
        const puCount = data[state][lga][ward].pollingUnits.length;
        puCountAccumulator += puCount;
        puCounts.push(puCount);
      })
    })
  })

  return {
    wardCount: wardCountAccumulator,
    puCount: puCountAccumulator,
    puCountsArray: puCounts
  }
}

readFullDataFile()
  .then((result) => {
    return checkPuCount(result);
  })
  .then((counts) => {
    const { wardCount, puCount, puCountsArray } = counts;
    const puCountsArraySum = puCountsArray.reduce((acc, curr) => acc + curr, 0);
    console.log('PU Count: ' + puCount);
    console.log('PU CountArray Sum: ' + puCountsArraySum);
    console.log('Ward Count: ' + wardCount);
  });