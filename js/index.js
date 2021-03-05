const proxy = "https://cors.bridged.cc/";
// const proxy = "https://cors-anywhere.herokuapp.com/";
//https://restcountries.herokuapp.com/api/v1/region/:region_name
const countrie_API = "https://restcountries.herokuapp.com/api/v1";
const COVID_API = "https://corona-api.com/countries";

const codeAndRegionArr = []; //an array of country objects with name, code and continent
const covidData = []; //an array of country objects with covid data - no continent
const contryData = []; //an array of country objects with covid data and continent
let asia = [];
let europe = [];
let africa = [];
let americas = [];
let oceania = [];
let confirmed = [];
let recovered = [];
let critical = [];
let deaths = [];

// ------------------- receive country list with region--------------------------------------------

async function getRegion() {
  const result = await fetch(`${proxy}${countrie_API}`);
  const parsed = await result.json();
  // structure:  parsed object >> array of 250 objects >>  object of country objects >> country data object
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

// ---------------- return the constinent according to the country code -------------------------
function getContinentByCode(code) {
  for (let i = 0; i < codeAndRegionArr.length; i++) {
    if (Object.values(codeAndRegionArr[i]).includes(code)) {
      return codeAndRegionArr[i].continent;
    }
  }
}

// ------------------------- receive covid stats, filter all relevant data and store in "covidData" array of country objects

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
        tempObj.continent = getContinentByCode(code.data[i].code);

        covidData.push(tempObj);
      }
      console.log(covidData);
    });
}
getRegion();

//---------------------- reset the content of the stats arrays

function resetStats() {
  confirmed = [];
  recovered = [];
  critical = [];
  deaths = [];
}

// assign the argument the correspoding countries-by-continent array (for use with "segmentByContinent" function)

function selectContinentArray(arr) {
  console.log(arr);
  if ((continent = "Asia")) {
    asia = arr;
  }
  if ((continent = "Europe")) {
    europe = arr;
  }
  if ((continent = "Africa")) {
    africa = arr;
  }
  if ((continent = "Americas")) {
    americas = arr;
  }
  if ((continent = "Oceania")) {
    oceania = arr;
  }
  return "done";
}

//   fill the stats arrays with data by continent

function segmentByContinent(continent) {
  resetStats();
  const temp = [];

  for (let i = 0; i < covidData.length; i++) {
    if (covidData[i].continent.toLowerCase() === continent.toLowerCase()) {
      temp.push(covidData[i].name);
      confirmed.push(covidData[i].confirmed);
      recovered.push(covidData[i].recovered);
      critical.push(covidData[i].critical);
      deaths.push(covidData[i].deaths);
    }
  }
  selectContinentArray(temp);
  return "done";
}

//create chart

xAxis = asia;
yAxis = confirmed;

const ctx = document.querySelector("#statChart").getContext("2d");
const chart = new Chart(ctx, {
  // The type of chart we want to create
  type: "line",

  // The data for our dataset
  data: {
    labels: xAxis,
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: yAxis,
      },
    ],
  },

  // Configuration options go here
  options: {
    layout: {
      padding: {
        left: 50,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
  },
});
