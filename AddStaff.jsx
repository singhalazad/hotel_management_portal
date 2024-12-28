import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import { addStaff, getAllGeoDataGuestReg } from "../API/api";
import { useNavigate } from "react-router-dom";
import Spin from "../components/loaders/Spin";

export default function AddStaff(props) {
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState({
    staff_name: "",
    staff_age: "",
    staff_gender: "",
    staff_country: "",
    staff_state: "",
    staff_district: "",
    staff_town: "",
    staff_pincode: "",
    mobile: "",
    email: "",
    hotel_user_name: props.hotelUserName,
    hotel: props.hotelId,
  });
  const [pinErr, setPinErr] = useState("");
  const [mobileErr, setMobileErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoGuestData, setGeoGuestData] = useState([]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setStaffData({ ...staffData, [id]: value });
  };

  const handlePin = (e) => {
    const { id, value } = e.target;
    const PinRegex = /^[0-9]{6}$/;

    if (value.trim() === "") {
      setPinErr("This field is required.");
      setStaffData({ ...staffData, [id]: value });
    } else if (PinRegex.test(value)) {
      setStaffData({ ...staffData, [id]: value });
      setPinErr("");
    } else {
      setPinErr("Please enter a 6-digit numeric PIN.");
      setStaffData({ ...staffData, [id]: value });
    }
    if (id == "staff_pincode" && value.length == 6) {
      setLoading(true);
      const pincodeData = {
        pincode: e.target.value,
      };
      getAllGeoDataGuestReg(pincodeData).then((res) => {
        if (res.Status == "Success") {
          setGeoGuestData(res.PostOffice);
          console.log(res.PostOffice);
          setStaffData((prevData) => ({
            ...prevData,
            staff_country: res.PostOffice[0]?.Country || "",
            staff_district: res.PostOffice[0]?.District || "",
            staff_state: res.PostOffice[0]?.State || "",
          }));
          setLoading(false);
        } else {
          console.log(res);
          setLoading(false);
        }
      });
    }
  };
  const handleMobile = (e) => {
    const { id, value } = e.target;
    const MobileNumberRegex = /^[0-9]{10}$/;

    if (value.trim() === "") {
      setMobileErr("This field is required.");
      setStaffData({ ...staffData, [id]: value });
    } else if (MobileNumberRegex.test(value)) {
      setStaffData({ ...staffData, [id]: value });
      setMobileErr("");
    } else {
      setMobileErr("Please enter a 10-digit numeric NUmber.");
      setStaffData({ ...staffData, [id]: value });
    }
  };
  const handleEmail = (e) => {
    const { id, value } = e.target;
    const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value.trim() === "") {
      setEmailErr("This field is required.");
      setStaffData({ ...staffData, [id]: value });
    } else if (EmailRegex.test(value)) {
      setStaffData({ ...staffData, [id]: value });
      setEmailErr("");
    } else {
      setEmailErr("Please enter a valid Email.");
      setStaffData({ ...staffData, [id]: value });
    }
  };
  const handleImageChange = (e) => {
    setStaffData({ ...staffData, documents: e.target.files });
  };

  useEffect(() => {
    console.log(props);
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addStaff(staffData)
      .then((res) => {
        if (res.status === "success") {
          toast.success("Staff Added Successfully");
          setTimeout(() => {
            navigate("/staff-list");
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };

  return (
    <div className="mainDiv p-2">
      <div className="col-12 d-flex justify-content-between">
        <div className="d-flex justify-content-end align-items-center px-5">
          <h4 className="p-3 pb-0">Add Staff</h4>
        </div>
      </div>
      <div>
        <form
          onSubmit={handleSubmit}
          className="col-12 row d-flex justify-content-start p-5"
        >
          <div className="mb-3 col-3">
            <label className="form-label">
              Name<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="staff_name"
              value={staffData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Position<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="position"
              value={staffData.position}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Age<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="number"
              className="form-control"
              id="staff_age"
              value={staffData.staff_age}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Gender<span style={{ color: "red" }}>*</span>
            </label>
            <select
              required
              type="text"
              className="form-control"
              id="staff_gender"
              value={staffData.staff_gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Pincode<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="number"
              className={`form-control ${pinErr ? "is-invalid" : ""}`}
              id="staff_pincode"
              value={staffData.staff_pincode}
              maxLength={6}
              onChange={handlePin}
            />
          </div>

          <div className="mb-3 col-3">
            <label className="form-label">
              Country<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="staff_country"
              value={staffData.staff_country}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              State<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="staff_state"
              value={staffData.staff_state}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              District<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="staff_district"
              value={staffData.staff_district}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Town<span style={{ color: "red" }}>*</span>
            </label>
            <select
              required
              type="text"
              className="form-select"
              id="guest_town"
              defaultValuezl={staffData.guest_town}
              onChange={handleInputChange}
            >
              <option value="">Select Town</option>
              {geoGuestData?.map((data, index) => (
                <option key={index} value={data.Name}>
                  {data.Name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Contact No.<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="number"
              className={`form-control ${mobileErr ? "is-invalid" : ""}`}
              id="mobile"
              value={staffData.mobile}
              onChange={handleMobile}
              maxLength={10}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Email<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              className={`form-control ${emailErr ? "is-invalid" : ""}`}
              id="email"
              value={staffData.email}
              onChange={handleEmail}
            />
          </div>
          <div className="d-flex justify-content-end">
            <Button type="submit" variant="contained">
              Add
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-center" />
      <Spin open={loading} />
    </div>
  );
}
