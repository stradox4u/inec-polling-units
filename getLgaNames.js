const axios = require('axios').default;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const fs = require('fs/promises');

axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
axios.defaults.headers.common['Accept'] = 'application/json';

const states = {}
const getLgasPromises = [];

const stateNames = [
  "ABIA",
  "ADAMAWA",
  "AKWA IBOM",
  "ANAMBRA",
  "BAUCHI",
  "BAYELSA",
  "BENUE",
  "BORNO",
  "CROSS RIVER",
  "DELTA",
  "EBONYI",
  "EDO",
  "EKITI",
  "ENUGU",
  "GOMBE",
  "IMO",
  "JIGAWA",
  "KADUNA",
  "KANO",
  "KATSINA",
  "KEBBI",
  "KOGI",
  "KWARA",
  "LAGOS",
  "NASARAWA",
  "NIGER",
  "OGUN",
  "ONDO",
  "OSUN",
  "OYO",
  "PLATEAU",
  "RIVERS",
  "SOKOTO",
  "TARABA",
  "YOBE",
  "ZAMFARA",
  "FEDERAL CAPITAL TERRITORY"
]
for (let i = 0; i < 37; i++) {
  const stateCode = i + 1;
  states[stateNames[i]] = {lgas: [], state_id: i + 1};
  getLgasPromises.push(getLgas({ state_id: stateCode, stateObject: states[stateNames[i]] }));
}

Promise.all(getLgasPromises).then(() => {
  return fs.writeFile('./statesAndLgas.json', JSON.stringify(states), 'utf8');
}).then(() => {
  console.log("Successfully wrote file");
})

async function getLgas({state_id, stateObject}) {
  const getLgasUrl = "https://main.inecnigeria.org/wp-content/themes/independent-national-electoral-commission/custom/views/lgaView.php";
  const response = await axios.post(getLgasUrl, { state_id });
  Object.values(response.data).forEach(lga => {
    stateObject.lgas.push(lga);
    lga.stateId = state_id;
  });
  return stateObject;
}

