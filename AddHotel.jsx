import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import { addHotel, getAllGeoDataHostelReg } from "../API/api";
import { Link, useNavigate } from "react-router-dom";
import footer from "../Images/bgImage.png";
import hplogo from "../Images/haryana-plice-logo-BC5F526ACF-seeklogo.com.png";
import logo from "../Images/Logo_Guestfolio.jpg";

export default function AddHotel() {
  const navigate = useNavigate();
  const [allGeoData, SetAllGeoData] = useState([]);
  const [name, setName] = useState("");
  const [hotelData, setHotelData] = useState({
    hotel_id: "",
    hotel_name: "",
    hotel_address: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    contact: "",
    email: "",
    owner_first_name: "",
    owner_last_name: "",
    owner_address: "",
    owner_state: "",
    owner_district: "",
    owner_city: "",
    owner_pincode: "",
    lat: "",
    long: "",
  });
  const [pinErr, setPinErr] = useState("");
  const [mobileErr, setMobileErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [firstNameErr, setFirstNameErr] = useState("");
  const [lastNameErr, setLastNameErr] = useState("");

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setHotelData({ ...hotelData, [id]: value });
  };
  const handlePin = (e) => {
    const { id, value } = e.target;
    const PinRegex = /^[0-9]{6}$/;
  
    if (value.trim() === "") {  
      setPinErr("This field is required.");
      setHotelData({ ...hotelData, [id]: value });  
    } else if (PinRegex.test(value)) {  
      setHotelData({ ...hotelData, [id]: value });
      setPinErr("");
    } else {
      setPinErr("Please enter a 6-digit numeric PIN.");  
      setHotelData({ ...hotelData, [id]: value });  
    }
  };
  const handleMobile = (e) => {
    const { id, value } = e.target;
    const MobileNumberRegex = /^[0-9]{10}$/;
  
    if (value.trim() === "") {  
      setMobileErr("This field is required.");
      setHotelData({ ...hotelData, [id]: value });  
    } else if (MobileNumberRegex.test(value)) {  
      setHotelData({ ...hotelData, [id]: value });
      setMobileErr("");
    } else {
      setMobileErr("Please enter a 10-digit numeric NUmber.");  
      setHotelData({ ...hotelData, [id]: value });  
    }
  };
  const handleEmail = (e) => {
    const { id, value } = e.target;
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (value.trim() === "") {  
      setEmailErr("This field is required.");
      setHotelData({ ...hotelData, [id]: value });  
    } else if (EmailRegex.test(value)) {  
      setHotelData({ ...hotelData, [id]: value });
      setEmailErr("");
    } else {
      setEmailErr("Please enter a valid Email.");  
      setHotelData({ ...hotelData, [id]: value });  
    }
  };
  const handleOwnerFirstName = (e) => {
    const { id, value } = e.target;
    const FirstNameRegex = /^[A-Za-z\s]+$/;
  
    if (value.trim() === "") {  
      setFirstNameErr("This field is required.");
      setHotelData({ ...hotelData, [id]: value });  
    } else if (FirstNameRegex.test(value)) {  
      setHotelData({ ...hotelData, [id]: value });
      setFirstNameErr("");
    } else {
      setFirstNameErr("Please enter valid First Name.");  
      setHotelData({ ...hotelData, [id]: value });  
    }
  };
  const handleOwnerLastName = (e) => {
    const { id, value } = e.target;
    const LastNameRegex = /^[A-Za-z\s]+$/;
  
    if (value.trim() === "") {  
      setFirstNameErr("This field is required.");
      setHotelData({ ...hotelData, [id]: value });  
    } else if (LastNameRegex.test(value)) {  
      setHotelData({ ...hotelData, [id]: value });
      setLastNameErr("");
    } else {
      setLastNameErr("Please enter valid Last Name.");  
      setHotelData({ ...hotelData, [id]: value });  
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  if (pinErr || mobileErr || emailErr || firstNameErr || lastNameErr ) {
    toast.error("Please fill out all required fields correctly.");
    return; 
  }
    const postData = {
      hotel_name: hotelData.hotel_name,
      hotel_user_name: hotelData.hotel_id,
      mobile: hotelData.contact,
      email: hotelData.email,
      hotel_address: hotelData.hotel_address,
      state: hotelData.state,
      district: hotelData.district,
      city: hotelData.city,
      pincode: hotelData.pincode,
      owner_first_name: hotelData.owner_first_name,
      owner_last_name: hotelData.owner_last_name,
      owner_house_address: hotelData.owner_address,
      owner_state: hotelData.owner_state,
      owner_district: hotelData.owner_district,
      owner_city: hotelData.owner_city,
      owner_pinode: hotelData.pincode,
      lat: hotelData.lat,
      long: hotelData.long,
    };
    addHotel(postData)
      .then((res) => {
        if (res.status === "success") {
          toast.success("Hotel Added Successfully");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };

  const getHotelAddress = () => {
    try {
      getAllGeoDataHostelReg()
        .then((res) => {
          SetAllGeoData(res);
          setHotelData((prevData) => ({
            ...prevData,
            state: res.region || "",
            city: res.city || "",
            pincode: res.postal_code || "",
            lat: res.latitude || "",
            long: res.longitude || "",
          }));
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {}
  };

  useEffect(() => {
    getHotelAddress();
  }, [name]);

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
      <div>
        <h4 className="px-5 mt-4">Register Hotel</h4>
        <form
          onSubmit={handleSubmit}
          className="col-12 row d-flex justify-content-start px-5 mt-4"
        >
          <div className="mb-3 col-3">
            <label className="form-label">
              Hotel Id<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="number"
              className="form-control"
              id="hotel_id"
              value={hotelData.hotel_id}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Hotel Name<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="hotel_name"
              value={hotelData.hotel_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Hotel Address<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="hotel_address"
              value={hotelData.hotel_address}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              State<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="state"
              value={hotelData.state}
              onChange={handleInputChange}
            />
          </div>
          {/* <div className="mb-3 col-3">
            <label className="form-label">
              District<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="district"
              value={hotelData.district}
              onChange={handleInputChange}
            />
          </div> */}
          <div className="mb-3 col-3">
            <label className="form-label">
              City<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="city"
              value={hotelData.city}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Pincode<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text" 
              className={`form-control ${pinErr ? "is-invalid" : ""}`}
              id="pincode"
              value={hotelData.pincode}
              maxLength={6}
              onChange={handlePin}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Contact no.<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="number"
              className={`form-control ${mobileErr ? "is-invalid" : ""}`}
              id="contact"
              value={hotelData.contact}
              onChange={handleMobile}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Email<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="email"
              className={`form-control ${emailErr ? "is-invalid" : ""}`}
              id="email"
              value={hotelData.email}
              onChange={handleEmail}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Owner First Name<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className={`form-control ${firstNameErr ? "is-invalid" : ""}`}
              id="owner_first_name"
              value={hotelData.owner_first_name}
              onChange={handleOwnerFirstName}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Owner Last Name<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className={`form-control ${lastNameErr ? "is-invalid" : ""}`}
              id="owner_last_name"
              value={hotelData.owner_last_name}
              onChange={handleOwnerLastName}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Owner Address<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="owner_address"
              value={hotelData.owner_address}
              onChange={handleInputChange}
            />
          </div>
          {/* <div className="mb-3 col-3">
            <label className="form-label">
              Owner State<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="owner_state"
              value={hotelData.owner_state}
              onChange={handleInputChange}
            />
          </div> */}
          {/* <div className="mb-3 col-3">
            <label className="form-label">
              Owner District<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="owner_district"
              value={hotelData.owner_district}
              onChange={handleInputChange}
            />
          </div> */}
          {/* <div className="mb-3 col-3">
            <label className="form-label">
              Owner City<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="owner_city"
              value={hotelData.owner_city}
              onChange={handleInputChange}
            />
          </div> */}
          {/* <div className="mb-3 col-3">
            <label className="form-label">
              Owner Pincode<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="number"
              className="form-control"
              id="owner_pincode"
              value={hotelData.owner_pincode}
              onChange={handleInputChange}
            />
          </div> */}
          <div className="mb-3 col-3">
            <label className="form-label">
              Latitude<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="number"
              className="form-control"
              id="lat"
              value={hotelData.lat}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Longitude<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="number"
              className="form-control"
              id="long"
              value={hotelData.long}
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <div className="col-2 mt-3 mx-5 d-flex align-items-center justify-content-center">
            <Button type="submit" className="col-12" variant="contained">
              Add
            </Button>
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
