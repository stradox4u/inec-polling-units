const {readdir, readFile, appendFile} = require('fs/promises');

async function readWards() {
  const wards = await readdir('./pusByWard');
  return wards;
}

const fullDataObject = {};


let wardCount = 0;
async function readSingleWard(filename) {
  const wardData = await readFile(filename, 'utf-8');
  const parsedWardData = await JSON.parse(wardData);
  console.log(parsedWardData);
  const id = Object.keys(parsedWardData)[0];
  const innerParsedData = parsedWardData[id];
  const { id: wardId, name: wardName, stateId, lgaId, pollingUnits } = innerParsedData;
  wardCount += 1;

  if (!Object.hasOwn(fullDataObject, stateId)) {
    fullDataObject[stateId] = {};
  }

  if (!Object.hasOwn(fullDataObject[stateId], lgaId)) {
    fullDataObject[stateId][lgaId] = {};
  }

  if (Object.hasOwn(fullDataObject[stateId], lgaId)) {
    fullDataObject[stateId][lgaId][wardId] = {};
    fullDataObject[stateId][lgaId][wardId].name = wardName;
    fullDataObject[stateId][lgaId][wardId].pollingUnits = pollingUnits;
  }
}

async function orchestrator() {

  const allWardsFileNames = await readWards();

  
  for (file of allWardsFileNames) {
    const filePath = './pusByWard/' + file;
    await readSingleWard(filePath);
  }

}

orchestrator()
  .then(() => {
    console.table(fullDataObject);
    return appendFile('./cleanedData.json', JSON.stringify(fullDataObject), 'utf-8')
  })
  .then(() => {
    console.log('WardCount: ' + wardCount);
    console.log('Operation Complete!');
})