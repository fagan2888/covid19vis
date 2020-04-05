import React, { Fragment } from "react";
import ReactDOMServer from "react-dom/server";
import { useLeaflet } from "react-leaflet";
import Typography from "@material-ui/core/Typography";
import Legend from "./Legend";
import TopoJSON from "./TopoJSON";
import CountryIcon from "../CountryIcon";
import countries from "../datasources/countries.geo.json";

function ReportPopup(props) {
  const { report } = props;

  let countryCode = null;
  if (report.CountryRegion["alpha-2"]) {
    countryCode = report.CountryRegion["alpha-2"].toLowerCase();
  }

  return (
    <div>
      <Typography variant="h6" component="h6">
        {countryCode && <CountryIcon code={countryCode} />}
        {report.CountryRegion.name}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Confirmed: {report.Confirmed}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Deaths: {report.Deaths}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        Recovered: {report.Recovered}
      </Typography>
    </div>
  );
}

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

  function showCountryStats(e) {
    const layer = e.target;
    layer.getPopup().setLatLng(e.latlng).openOn(map);
  }

  function hideCountryStats(e) {
    const layer = e.target;
    layer.closePopup();
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
      />
      <Legend options={legendOptions} />
    </Fragment>
  );
}
