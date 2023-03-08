const axios = require('axios').default;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const { readFile, writeFile } = require('fs/promises');

axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.headers.common['Accept'] = 'application/json';

const allPollingUnits = [];
let allWardsArray = [];

async function getPollingUnits({ state_id, lga_id, ward_id, index }) {
  const getPollingUnitsUrl = "https://main.inecnigeria.org/wp-content/themes/independent-national-electoral-commission/custom/views/pollingView.php"
  const response = await axios.post(getPollingUnitsUrl, {
    state_id,
    lga_id,
    ward_id,
  });

  console.log(response.data);
  Object.values(response.data).forEach(pollingUnit => {
    allPollingUnits.push(pollingUnit)
  });
  const filteredPUs = Object.values(response.data).filter(Boolean);
  let ward = allWardsArray[index];
  console.log(index);
  ward.pollingUnits = filteredPUs;

  writeFile(`./pusByWard/${ward.id}-pollingUnits.json`, JSON.stringify({ [ward.id]: ward }), 'utf-8')
    .then(async () => {
      ward = allWardsArray[index + 1];
      if (index === allWardsArray.length) return;
    
      await getPollingUnits({
        state_id: ward.stateId,
        lga_id: ward.lgaId,
        ward_id: ward.id,
        index: index + 1
      });
    })
}

readFile('./allWards.json', 'utf-8')
  .then((allWards) => {
    return JSON.parse(allWards);
  }).then((wards) => {
    allWardsArray = wards.allWards;
    const ward = wards.allWards[0];
    return getPollingUnits({ state_id: ward.stateId, lga_id: ward.lgaId, ward_id: ward.id, index: 0 });
  });
