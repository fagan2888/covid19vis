import React, { useContext } from "react";
import { Map, TileLayer } from "react-leaflet";
import ReportLayer from "./ReportLayer";
import { ReportContext } from "../ReportContext";
import "./MapView.css";

function MapView() {
  const reportCtx = useContext(ReportContext);
  const { dataSource: reportTable } = reportCtx;

  return (
    <Map
      center={[40, 0]}
      zoom={3}
      doubleClickZoom={false}
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer
        noWrap={true}
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      <ReportLayer dataSource={reportTable} />
    </Map>
  );
}

const areEqual = (prevProps, nextProps) => {
  return true;
};

export default React.memo((props) => {
  return <MapView {...props} />;
}, areEqual);
