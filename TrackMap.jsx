import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  Polygon,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon issue in Webpack
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { HaryanaBoundary } from "./Haryana";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const TrackMap = (props) => {
  const geoJSONStyle = {
    color: "blue",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.1,
  };

  const purpleOptions = { color: "red" };

  const position = [29.2, 76.2];

  useEffect(() => {
    console.log(props.data);
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={7.5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={HaryanaBoundary} style={geoJSONStyle} />
        {props.data.map((data, index) => (
          <Marker position={data.latLong} key={index}>
            <Popup>
              <div className="d-flex row">
                <span className="d-flex">
                  <p>
                    <span className="fw-bold">
                      Hotel Name: {data.hotel_name}
                    </span>
                  </p>
                </span>
                <span className="d-flex" style={{ marginTop: "-20px" }}>
                  <p>
                    <span className="fw-bold">
                      Location: {data.city + ", " + data.district}
                    </span>
                  </p>
                </span>
                <span className="d-flex" style={{ marginTop: "-20px" }}>
                  <p>
                    <span className="fw-bold">
                      Check-in Time: {data.checkIn}
                    </span>
                  </p>
                </span>

                <span className="d-flex" style={{ marginTop: "-20px" }}>
                  <p>
                    <span className="fw-bold">
                      Check-out Time: {data.checkOut}
                    </span>
                  </p>
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        <Polygon
          pathOptions={purpleOptions}
          positions={props.data.map((point) => point.latLong)}
        />
      </MapContainer>
    </div>
  );
};

export default TrackMap;
