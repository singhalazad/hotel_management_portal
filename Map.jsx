import React from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
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

const Map = (props) => {
  const position = [29.2, 76.2];

  const geoJSONStyle = {
    color: "blue",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.1,
  };

  return (
    <div className="d-flex justify-content-center" style={{ height: "100%", width: "80%", overflow:"hidden" }}>
      <MapContainer
        center={position}
        zoom={7.5}
        style={{ height: "110%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={HaryanaBoundary} style={geoJSONStyle} />
        {props?.mapData?.map((data) => (
          <Marker position={data.location}>
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
                      Total Guests: {data.total_guests}
                    </span>
                  </p>
                </span>

                <span className="d-flex" style={{ marginTop: "-20px" }}>
                  <p>
                    <span className="fw-bold">
                      Outstate Guests: {data.non_haryana_guests}
                    </span>
                  </p>
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;