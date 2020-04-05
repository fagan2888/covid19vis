import React, { Fragment } from "react";
import { useLeaflet } from "react-leaflet";
import Legend from "./Legend";
import TopoJSON from "./TopoJSON";
import countries from "../datasources/countries.geo.json";

export default function ReportLayer(props) {
  const { map } = useLeaflet();

  const legendOptions = [
    {
      minValue: 0,
      background: "#d2e3fc",
    },
    {
      minValue: 1000,
      background: "#8ab4f8",
    },
    {
      minValue: 5000,
      background: "#4285f4",
    },
    {
      minValue: 50000,
      background: "#1967d2",
    },
    {
      minValue: 100000,
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

  function getCountryStats(countryCode) {
    return props.dataSource.rows.find((item) => {
      return item.CountryRegion["alpha-3"] === countryCode;
    });
  }

  function processFeature(feature, layer) {
    const result = getCountryStats(feature.id);
    if (result) {
      layer.setStyle({ fillColor: getReportColor(result) });

      const popupContent = `<div><h3>${result.CountryRegion.name}</h3>
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
      <TopoJSON
        onEachFeature={processFeature}
        style={getCountryStyle}
        data={countries}
      />
      <Legend options={legendOptions} />
    </Fragment>
  );
}
