import React from "react";

const dataSourceSettings_before0321 = {
  url:
    "https://vg-cors-anywhere.azurewebsites.net/https://raw.github.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/{reportDate}.csv",
  columnNameMappings: {
    "Country/Region": "CountryRegion",
    "Province/State": "ProvinceState",
    Confirmed: "Confirmed",
    Deaths: "Deaths",
    Recovered: "Recovered",
  },
  columnTypeMappings: {
    Deaths: "number",
    Recovered: "number",
    Confirmed: "number",
  },
  countryMapping: {
    US: "United States of America",
    '"Korea, South"': "South Korea",
    Czechia: "Czech Republic",
  },
  preserveNames: true,
};

export const dataSourceSettings = {
  url:
    "https://vg-cors-anywhere.azurewebsites.net/raw.github.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/{reportDate}.csv",
  columnNameMappings: {
    Country_Region: "CountryRegion",
    Province_State: "ProvinceState",
    Confirmed: "Confirmed",
    Deaths: "Deaths",
    Recovered: "Recovered",
    Active: "Active",
  },
  columnTypeMappings: {
    Deaths: "number",
    Recovered: "number",
    Confirmed: "number",
  },
  countryMapping: {
    US: "United States of America",
    '"Korea, South"': "South Korea",
    Czechia: "Czech Republic",
  },
  preserveNames: true,
};

export const ReportContext = React.createContext(null);
