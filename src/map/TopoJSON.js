import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { GeoJSON } from "react-leaflet";
import * as topojson from "topojson-client";

function TopoJSON(props, ref) {
  const layerRef = useRef(null);
  const { data, ...restProps } = props;
  useImperativeHandle(ref, () => layerRef.current);

  useEffect(() => {
    function addData(layer, jsonData) {
      if (jsonData.type === "Topology") {
        for (let key in jsonData.objects) {
          let geojson = topojson.feature(jsonData, jsonData.objects[key]);
          layer.addData(geojson);
        }
      } else {
        layer.addData(jsonData);
      }
    }

    const layer = layerRef.current.leafletElement;
    addData(layer, data);
  }, [data]);

  return <GeoJSON ref={layerRef} {...restProps} />;
}


export default forwardRef(TopoJSON)