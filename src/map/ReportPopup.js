import React, { } from "react";
import Typography from "@material-ui/core/Typography";
import CountryIcon from "../CountryIcon";

export default function ReportPopup(props) {
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