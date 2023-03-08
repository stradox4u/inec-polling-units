const axios = require('axios').default;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const fs = require('fs/promises');

axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.headers.common['Accept'] = 'application/json';

const states = {}
const getLgasPromises = [];
const getWardsPromises = [];
const getPollingUnitsPromises = [];
const allLgas = [];
const allWards = [];
const allPollingUnits = [];

for (let i = 1; i < 38; i++) {
  const stateCode = i;
  states[stateCode] = {lgas: []};
  getLgasPromises.push(getLgas({ state_id: stateCode, stateObject: states[stateCode] }))
}

Promise.all(getLgasPromises).then(() => {
  for (const lga of allLgas) {
    getWardsPromises.push(getWards({ state_id: lga.stateId, lga_id: lga.abbreviation }));
  }
  return Promise.all(getWardsPromises);
}).then(() => {
  console.log(allWards.length);
  return fs.writeFile('./allWards.json', JSON.stringify({allWards}), 'utf8');
}).then(() => {
  console.log("Successfully wrote file");
})

async function getLgas({state_id, stateObject}) {
  const getLgasUrl = "https://main.inecnigeria.org/wp-content/themes/independent-national-electoral-commission/custom/views/lgaView.php";
  const response = await axios.post(getLgasUrl, { state_id });
  Object.values(response.data).forEach(lga => {
    stateObject.lgas.push(lga);
    lga.stateId = state_id;
    allLgas.push(lga);
  })
  return stateObject;
}

async function getWards({ state_id, lga_id }) {
  const getWardsUrl = "https://main.inecnigeria.org/wp-content/themes/independent-national-electoral-commission/custom/views/wardView.php";
  const response = await axios.post(getWardsUrl, { state_id, lga_id });
  
  if (response.data) {
    Object.values(response.data).forEach(ward => {
      ward.stateId = state_id;
      ward.lgaId = lga_id;
      allWards.push(ward);
    })
  } else {
      console.log(state_id, lga_id);
      console.log(allLgas.find((el) => el.id === lga_id));
  }
  return allWards;
}

