const proxy = "https://cors.bridged.cc/";
// const proxy = "https://cors-anywhere.herokuapp.com/";
//https://restcountries.herokuapp.com/api/v1/region/:region_name
const countrie_API = "https://restcountries.herokuapp.com/api/v1";
const COVID_API = "https://corona-api.com/countries";

const codeAndRegionArr = []; //an array of country objects with name, code and continent
const covidData = []; //an array of country objects with covid data - no continent
const contryData = []; //an array of country objects with covid data and continent

async function getRegion() {
  const result = await fetch(`${proxy}${countrie_API}`);
  const parsed = await result.json();

  // structure:  parsed object >> array of 250 objects >>  object of country objects >> country data object

  // we need to create an array that contains an object with cc2 and region to add/map to our covid country objects

  for (i = 0; i < Object.entries(parsed).length; i++) {
    const tempObj = {};
    tempObj.name = parsed[i].name.common;
    tempObj.code = parsed[i].cca2;
    tempObj.continent = parsed[i].region;
    codeAndRegionArr.push(tempObj);
  }
  console.log(codeAndRegionArr);
  getCovidData();
}

function getContinentByCode(code) {
  for (let i = 0; i < codeAndRegionArr.length; i++) {
    if (Object.values(codeAndRegionArr[i]).includes(code)) {
      return codeAndRegionArr[i].continent;
    }
  }
}

function getCovidData() {
  fetch(COVID_API)
    .then((response) => response.json())
    .then((code) => {
      for (let i = 0; i < code.data.length; i++) {
        const tempObj = {};
        tempObj.name = code.data[i].name;
        tempObj.confirmed = code.data[i].latest_data.confirmed;
        tempObj.recovered = code.data[i].latest_data.recovered;
        tempObj.critical = code.data[i].latest_data.critical;
        tempObj.deaths = code.data[i].latest_data.deaths;
        tempObj.code = code.data[i].code;
        const temp = code.data[i].code;
        tempObj.continent = getContinentByCode(temp);

        covidData.push(tempObj);
      }
      console.log(covidData);
    });
}
getRegion();
