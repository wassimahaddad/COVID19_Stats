//! Variables, arrays and Objects ---------------------------------------------
const countrie_API = "https://restcountries.herokuapp.com/api/v1";
const COVID_API = "https://corona-api.com/countries";
const proxy = "https://cors.bridged.cc/";
const codeAndRegionArr = []; //an array of country objects with name, code and continent
const covidData = []; //an array of country objects with covid data - no continent
const contryData = []; //an array of country objects with covid data and continent
let asia = []; //an array of countries in Asia
let europe = []; //an array of countries in Europe
let africa = []; //an array of countries in Africa
let americas = []; //an array of countries in Americas
let oceania = []; //an array of countries in Oceania
let world = []; //an array of all countries
let confirmed = []; // a dymanically assigned confirmed cases array
let recovered = []; // a dymanically assigned recovered cases array
let critical = []; // a dymanically assigned critical cases array
let deaths = []; // a dymanically assigned dead cases array
let singleCountryStats = {}; //a dynamically assigned object with single-country stats
let regions = [];
let chartState = {
  continent: [],
  cases: [],
  category: "confirmed",
  contName: "",
};
//! Functions------------------------------------------------------------------

// Return the continent from the "codeAndRegionArr" array according to the country code --------

function getContinentByCode(code) {
  for (let i = 0; i < codeAndRegionArr.length; i++) {
    if (Object.values(codeAndRegionArr[i]).includes(code)) {
      return codeAndRegionArr[i].continent;
    }
  }
}

//fetch COVID19 stats, filter all relevant data and store in "covidData" array of country objects

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

// fetch country list with region--------------------------------------------

async function getRegion() {
  const result = await fetch(`${proxy}${countrie_API}`);
  const parsed = await result.json();
  for (i = 0; i < Object.entries(parsed).length; i++) {
    const tempObj = {};
    tempObj.name = parsed[i].name.common;
    tempObj.code = parsed[i].cca2;
    tempObj.continent = parsed[i].region;
    codeAndRegionArr.push(tempObj);
  }
  console.log(codeAndRegionArr);
  getCovidData(); // call covid data fetch
}

getRegion(); //get all data when page loads

//Reset the content of the stats arrays--------------------------------------------

function resetStats() {
  confirmed = [];
  recovered = [];
  critical = [];
  deaths = [];
  world = [];
}
// World stats---------------------------------------------------------------------

function worldStats() {
  resetStats();
  for (let i = 0; i < covidData.length; i++) {
    world.push(covidData[i].name);
    confirmed.push(covidData[i].confirmed);
    recovered.push(covidData[i].recovered);
    critical.push(covidData[i].critical);
    deaths.push(covidData[i].deaths);
  }
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

//fill the stats arrays with data by continent--------------------------------------

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

//Stats by single country-------------------------------------------------------------

function statsByCounty(country) {
  singleCountryStats = {};
  for (i = 0; i < covidData.length; i++) {
    if (covidData[i].name === country) {
      console.log(covidData[i]);
      singleCountryStats = covidData[i];
    }
  }
}

// Create an Object to display data from ------------------

function createObject(region) {
  if (region === "world") {
    worldStats();
  } else {
    segmentByContinent(region);
  }

  let continent = [];
  if (region === "asia") {
    continent = asia;
  }
  if (region === "europe") {
    continent = europe;
  }
  if (region === "africa") {
    continent = africa;
  }
  if (region === "americas") {
    continent = americas;
  }
  if (region === "oceania") {
    continent = asia;
  }
  if (region === "oceania") {
    continent = asia;
  }
  if (region === "world") {
    continent = world;
  }

  return {
    region: region,
    countries: continent,
    category: {
      confirmed: confirmed,
      recovered: recovered,
      critical: critical,
      deaths: deaths,
    },
  };
}

// return corresponding case array according to categoey
function caseByCategory(cat) {
  if (cat === "confirmed") {
    return confirmed;
  }
  if (cat === "recovered") {
    return recovered;
  }
  if (cat === "critical") {
    return critical;
  }
  if (cat === "deaths") {
    return deaths;
  }
}
//Draw chart -------------------------------------------------------------------------

function drawChart(xAxis, yAxis, cat, region) {
  const ctx = document.querySelector("#statChart").getContext("2d");
  region = region.charAt(0).toUpperCase() + region.slice(1);
  const chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      labels: xAxis,
      datasets: [
        {
          label: `COVID19 ${cat} cases in ${region}`,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: yAxis,
        },
      ],
    },

    // Configuration options go here
    options: {},
  });
}

//!Event Listeners----------------------------------------

const geography = document.querySelector(".geography");
const stats = document.querySelector(".stats");

geography.addEventListener("click", (e) => {
  regions = createObject(e.target.className);
  console.log(regions);
  chartState.continent = regions.countries;
  chartState.cases = regions.category.confirmed;
  chartState.contName = regions.region;
  drawChart(
    chartState.continent,
    chartState.cases,
    chartState.category,
    chartState.contName
  );
  listCountriesByRegion(chartState.continent, chartState.contName);
});

function listCountriesByRegion(region, name) {
  const countryContainer = document.querySelector(".country-container");
  countryContainer.innerHTML = "";
  for (let i = 0; i < region.length; i++) {
    const link = document.createElement("a");
    link.href = "#";
    const country = document.createElement("h4");
    country.className = name;
    country.textContent = region[i];
    countryContainer.appendChild(link);
    link.appendChild(country);
  }
}

stats.addEventListener("click", (e) => {
  chartState.category = e.target.className;
  console.log(e.target.className);
  chartState.cases = caseByCategory(e.target.className);
  console.log(chartState.cases);
  drawChart(
    chartState.continent,
    chartState.cases,
    chartState.category,
    chartState.contName
  );
});
