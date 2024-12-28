import React from "react";
import { useEffect } from "react";
import AdminDashboard from "../components/Dashboards/AdminDashboard";
import HotelDashboard from "../components/Dashboards/HotelDashboard";

export default function Dashboard(props) {
  useEffect(() => {
    console.log(props.hotelUserName);
  }, []);

  return (
    <div className="col-12 m-0 p-0">
      {props.role === "H" ? (
        <HotelDashboard hotelUserName={props.hotelUserName} />
      ) : (
        <AdminDashboard hotelUserName={props.hotelUserName}/>
      )}
    </div>
  );
}
