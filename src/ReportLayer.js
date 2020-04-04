import React, { Fragment } from "react";
import { GeoJSON, useLeaflet } from "react-leaflet";
import Legend from "./Legend";

export default function ReportLayer(props) {
  const { reportDataSource, countriesDataSource } = props;
  const { map } = useLeaflet();

  const legendOptions = [
    {
      minValue: 0,
      background: "#d2e3fc",
    },
    {
      minValue: 50,
      background: "#8ab4f8",
    },
    {
      minValue: 100,
      background: "#4285f4",
    },
    {
      minValue: 1000,
      background: "#1967d2",
    },
    {
      minValue: 10000,
      background: "#174ea6",
    },
  ];

  function getReportColor(statistics) {
    let result = "#D3D3D3"; //default
    for (let i = 0; i < legendOptions.length; i++) {
      if (statistics.Confirmed >= legendOptions[i].minValue) {
        result = legendOptions[i].background;
      }
    }
    return result;
  }

  function getCountryStyle(feature) {
    return {
      color: "#1f2021",
      weight: 0.1,
      opacity: 1,
      fillOpacity: 0.7,
      fillColor: "#D3D3D3",
    };
  }

  function getCountryStats(countryName) {
    return reportDataSource.rows.find((item) => {
      return item["CountryRegion"] === countryName;
    });
  }

  function processFeature(feature, layer) {
    const { name: countryName } = feature.properties;
    const result = getCountryStats(countryName);
    if (result) {
      layer.setStyle({ fillColor: getReportColor(result) });

      const popupContent = `<div><h3>${feature.properties.name}</h3>
          <div>Confirmed: ${result.Confirmed}</div>
          <div>Deaths: ${result.Deaths}</div>
          <div>Recovered: ${result.Recovered}</div>    
      </div>`;
      layer.bindPopup(popupContent);

      layer.on({
        mouseover: (e) => {
          layer.getPopup().setLatLng(e.latlng).openOn(map);
        },
        mouseout: (e) => layer.closePopup(),
        mousemove: (e) => {
          //layer.closePopup();
          layer.getPopup().setLatLng(e.latlng).openOn(map);
        },
      });
    } else {
      //console.log(countryName);
    }
  }

  return (
    <Fragment>
      <GeoJSON
        onEachFeature={processFeature}
        style={getCountryStyle}
        data={countriesDataSource}
      />
      <Legend options={legendOptions} />
    </Fragment>
  );
}
