import React, { useEffect, useState, Fragment } from "react";
import { HashRouter, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { ReportContext } from "./ReportContext";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dashboard from "./Dashboard";
import MapView from "./map/MapView";
import ReportView from "./ReportView";
import { getLatestReport } from "./ReportLoader";
import { createBrowserHistory } from 'history';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
}));

function ProgressBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress />
    </div>
  );
}

export default function App() {
  const [reportDataSource, setReportDataSource] = useState(null);
  useEffect(() => {
    async function getReport() {
      let dataSource = await getLatestReport(1);
      setReportDataSource(dataSource);
    }
    getReport();
  }, []);

  const history = createBrowserHistory({forceRefresh:false});

  return (
    <HashRouter history={history}>
      <ReportContext.Provider
        value={{
          dataSource: reportDataSource
        }}
      >
        <Dashboard>
          {reportDataSource ? (
            <Fragment>
              <Route exact path="/" component={MapView} />
              <Route exact path="/list" component={ReportView} />
            </Fragment>
          ) : (
            <ProgressBar />
          )}
        </Dashboard>
      </ReportContext.Provider>
    </HashRouter>
  );
}
