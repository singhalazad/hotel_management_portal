import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginImage from "../LoginImage";
import ManageHotel from "../Pages/ManageHotel";
import AddHotel from "../Pages/AddHotel";
import GuestsListReports from "../Pages/reports/GuestsReports";
import AddGuests from "../Pages/AddGuest";
import ManageGuests from "../Pages/ManageGuests";
import ApproveHotel from "../Pages/ApproveHotels";
import Dashboard from "../Pages/Dashboard";
import SetPassword from "../Pages/SetPassword";
import TrackGuest from "../Pages/TrackGuest";
import AddAdmin from "../Pages/AddAdmin";
import AdminList from "../Pages/AdminList";
import StaffList from "../Pages/StaffList";
import AddStaff from "../Pages/AddStaff";
import { getNotification } from "../API/api";

const AppRoutes = () => {
  const [role, setRole] = useState(sessionStorage.getItem("userRole"));
  const [hotelId, setHotelId] = useState(sessionStorage.getItem("hotelId"));
  const [hotelUserName, setHotelUserName] = useState(
    sessionStorage.getItem("hoteluserName")
  );
  const [notification, setNotification] = useState([]);
  const [count,setCount] = useState(0);


  function fetchRole(userRole, hotelId, hoteluserName) {
    setRole(
      sessionStorage.getItem("userRole")
        ? sessionStorage.getItem("userRole")
        : userRole
    );
    setHotelId(
      sessionStorage.getItem("hotelId")
        ? sessionStorage.getItem("hotelID")
        : hotelId
    );
    setHotelUserName(
      sessionStorage.getItem("hoteluserName")
        ? sessionStorage.getItem("hoteluserName")
        : hoteluserName
    );
    sessionStorage.setItem("userRole", userRole);
    sessionStorage.setItem("hotelId", hotelId);
    sessionStorage.setItem("hoteluserName", hoteluserName);
  }
  const handleNotificationAPI = async () => {
    try {
      await getNotification().then((res) => {
        if (res != "") {
          setNotification(res.notifications);
          setCount(res.notifications_count);
          console.log(res);
        } else {
          console.log("error->", res);
        }
      });
    } catch (error) {}
  };
  useEffect(()=>{
    handleNotificationAPI();
  },[])

  const PrivateRoutesData = [
    {
      path: "/dashboard",
      component: Dashboard,
      allowedRoles: ["A", "H", "S"],
    },
    {
      path: "/manage-guests",
      component: ManageGuests,
      allowedRoles: ["H"],
    },
    {
      path: "/add-guest",
      component: AddGuests,
      allowedRoles: ["H"],
    },
    {
      path: "/view-hotels",
      component: ManageHotel,
      allowedRoles: ["A", "S"],
    },
    {
      path: "/approve-hotels",
      component: ApproveHotel,
      allowedRoles: ["A"],
    },
    {
      path: "/guest-reports",
      component: GuestsListReports,
      allowedRoles: ["A", "S"],
    },
    {
      path: "/track-guest",
      component: TrackGuest,
      allowedRoles: ["A", "S"],
    },
    {
      path: "/admin-list",
      component: AdminList,
      allowedRoles: ["S"],
    },
    {
      path: "/add-admin",
      component: AddAdmin,
      allowedRoles: ["S"],
    },
    {
      path: "/staff-list",
      component: StaffList,
      allowedRoles: ["H","A", "S"],
    },
    {
      path: "/add-staff",
      component: AddStaff,
      allowedRoles: ["H"],
    },
  ];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginImage fetchRole={fetchRole} />} />
        <Route path="/add-hotel" element={<AddHotel />} />
        <Route path="/forgotpassword" element={<SetPassword />} />
        {PrivateRoutesData.map((data) => (
          <Route
            key={data.path}
            path={data.path}
            element={
              <ProtectedRoute
                component={data.component}
                role={role}
                allowedRoles={data.allowedRoles}
                hotelId={hotelId}
                hotelUserName={hotelUserName}
                notification={notification}
                count={count}
              />
            }
          />
        ))}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
