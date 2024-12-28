import React, { useState } from "react";
import TrackMap from "../components/Map/TrackMap";
import { Button, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getGuestPoints } from "../API/api";

export default function TrackGuest() {
  const [search, setSearch] = useState(false);
  const [key, setKey] = useState("");
  const [data, setData] = useState([]);
  const [guestName, setGuestName] = useState("")

  const handleChange = (e) => {
    setKey(e.target.value);
  };

  const handleSearch = () => {
    getGuestPoints(key)
      .then((res) => {
        setGuestName(res[0].guest_name)
        setData(
          res.map((guest) => ({
            hotel_name: guest.hotel.hotel_name,
            district: guest.hotel.district,
            city: guest.hotel.city,
            latLong: [guest.hotel.lat, guest.hotel.long],
            checkIn: guest.check_in,
            checkOut: guest.check_out,
          }))
        );
        setSearch(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="col-12">
      <h3 className="p-4 pb-0 px-5 mx-5">Track Guest<span className="text-primary"> {guestName}</span></h3>
      <div className="col-12 mb-3 d-flex justify-content-center align-items-center">
        <TextField
          label="Search by Document Number..."
          variant="outlined"
          type="number"
          fullWidth
          value={key}
          onChange={handleChange}
          style={{
            display: "flex",
            marginLeft: "3rem",
            width: "30rem",
            borderRadius: "35px",
            marginTop: "20px",
          }}
          required
        />
        <Button
          variant="contained"
          className="mx-3 mt-4"
          onClick={handleSearch}
        >
          <SearchIcon />
        </Button>
      </div>
      {search ? (
        <div
          className="col-12 d-flex justify-content-center m-0 pt-0 p-5"
          style={{ height: "85vh" }}
        >
          <div className="col-10 p-0">
            <TrackMap data={data} />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
