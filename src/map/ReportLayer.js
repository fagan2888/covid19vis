import React, { Fragment, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import { useLeaflet } from "react-leaflet";
import * as L from "leaflet";
import Legend from "./Legend";
import ReportPopup from "./ReportPopup";
import TopoJSON from "./TopoJSON";
import countries from "../datasources/countries.geo.json";

export default function ReportLayer(props) {
  const { map } = useLeaflet();
  const layerRef = useRef(null);

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

  function showCountryStats(e) {
    const layer = e.target;
    layer.getPopup().setLatLng(e.latlng).openOn(map);
    layer.setStyle({
      weight: 1,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  function hideCountryStats(e) {
    const layer = e.target;
    layer.closePopup();
    layer.setStyle({
      weight: 0.1,
    });
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
      const popupContent = ReactDOMServer.renderToString(
        <ReportPopup report={result} />
      );
      layer.bindPopup(popupContent);

      layer.on({
        mouseover: showCountryStats,
        mouseout: hideCountryStats,
        mousemove: showCountryStats,
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
        ref={layerRef}
      />
      <Legend options={legendOptions} />
    </Fragment>
  );
}
