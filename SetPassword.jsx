import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import { addHotel, getOptApi, setPassword } from "../API/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import footer from "../Images/bgImage.png";
import hplogo from "../Images/haryana-plice-logo-BC5F526ACF-seeklogo.com.png";
import logo from "../Images/Logo_Guestfolio.jpg";

export default function AddHotel() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [notConfirm, setNotConfirm] = useState(false);
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get("username");

  const [hotelData, setHotelData] = useState({
    username: username,
    new_password: "",
    confirm: "",
    manualOtp: "",
  });

  const getOtp = () => {
    getOptApi(username)
      .then((res) => {
        if (res.status === "OTP sent successfully") {
          toast.success("OTP sent on Mail");
          setOtp(res.otp);
          setDisabled(false);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setHotelData({ ...hotelData, [id]: value });

    if (id === "confirm") {
      if (value === "") {
        setNotConfirm(false);
      } else {
        setNotConfirm(hotelData.new_password !== value);
      }
    }

    if (id === "manualOtp") {
      if (value === "") {
        setInvalidOtp(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      username: hotelData.username,
      new_password: hotelData.new_password,
    };

    if (otp === hotelData.manualOtp) {
      setPassword(postData)
        .then((res) => {
          if (res.status === "password updated successfully") {
            toast.success("Password Set Successfully");
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong!");
        });
    } else {
      setInvalidOtp(true);
    }
  };

  return (
    <div className="mainDiv">
      <nav className="navbar navbar-expand-lg bg-body-light">
        <div className="container-fluid">
          <Link className="navbar-brand p-2" to="/">
            <img alt="HP logo" src={hplogo} style={{ height: "4rem" }} />
          </Link>
          <Link className="navbar-brand" to="#">
            <img alt="logo" src={logo} height="70px" width="150px" />
          </Link>
        </div>
      </nav>
      <div className="col-12 d-flex row d-flex justify-content-center p-2 mt-3 align-items-center">
        <form
          onSubmit={handleSubmit}
          className="col-4 row rounded d-flex justify-content-center p-3 align-items-center"
          style={{ boxShadow: "0 0 30px lightgray" }}
        >
          <h5 className="col-12 px-5 mt-2 mb-4 text-center">
            Set New Password
          </h5>
          <div className="col-12 d-flex row justify-content-center align-items-center">
            <div className="mb-3 col-11">
              <label className="form-label">
                New Password<span style={{ color: "red" }}> *</span>
              </label>
              <input
                required
                type="text"
                className="form-control"
                id="new_password"
                value={hotelData.new_password}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3 col-11">
              <label className="form-label">
                Confirm Password<span style={{ color: "red" }}> *</span>
                {notConfirm ? (
                  <span className="text-danger fw-bold">
                    {" "}
                    Passwords do not match!
                  </span>
                ) : (
                  ""
                )}
              </label>
              <input
                required
                type="text"
                className="form-control"
                id="confirm"
                value={hotelData.confirm_password}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-4 d-flex justify-content-start align-items-center">
              <Button
                type="button"
                className="mt-3 col-12"
                variant="outlined"
                onClick={getOtp}
              >
                Get OTP
              </Button>
            </div>
            <div className="mb-3 col-7">
              <label className="form-label">
                OTP<span style={{ color: "red" }}> *</span>
                {invalidOtp ? (
                  <span className="text-danger fw-bold"> Invalid OTP!</span>
                ) : (
                  ""
                )}
              </label>
              <input
                required
                type="text"
                className="form-control"
                id="manualOtp"
                value={hotelData.manualOtp}
                onChange={handleInputChange}
                disabled={disabled}
              />
            </div>
            <div className="col-3 mt-3 mx-5 d-flex align-items-center justify-content-center">
              <Button type="submit" className="col-12" variant="contained">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className="col-12 footer mt-1">
        <img
          className="col-12"
          alt="footer"
          src={footer}
          style={{ height: "6rem" }}
        />
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
