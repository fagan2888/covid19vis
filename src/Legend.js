import * as L from "leaflet";
import React, { useEffect} from "react";
import ReactDOM from "react-dom";
import { useLeaflet } from "react-leaflet";

function LegendControl(props) {
  const { options } = props;
  function getBarStyle(opt) {
    return {
      background: opt.background
    };
  }

  return (
    <div className="info legend">
      <h4>Confirmed cases</h4>
      {options.map((opt, i) => {
        return (
          <div key={i}>
            <i style={getBarStyle(opt)}></i>
            {i === options.length - 1 ? (
              <span>{opt.minValue}+ </span>
            ) : (
              <span>
                {opt.minValue} &ndash; {options[i + 1].minValue}
              </span>
            )}
            <br />
          </div>
        );
      })}
    </div>
  );
}

function Legend(props) {
  const { map } = useLeaflet();
  useEffect(() => {
    let control = L.control({ position: "topright" });
    control.onAdd = function(map) {
      const container = L.DomUtil.create("div");
      ReactDOM.render(<LegendControl {...props} />, container);
      return container;
    };
    control.addTo(map);
  }, [map, props]);

  return null;
}

export default Legend;
