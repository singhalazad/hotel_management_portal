import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import { addGuest, getAllGeoDataGuestReg } from "../API/api";
import { useNavigate } from "react-router-dom";
import Spin from "../components/loaders/Spin";

export default function AddGuests(props) {
  const navigate = useNavigate();
  const [geoGuestData, setGeoGuestData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pinErr, setPinErr] = useState("");
  const [mobileErr, setMobileErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [panErr, setPanErr] = useState("");
  const [aadharErr, setAadharErr] = useState("");
  const [dLErr, setDLErr] = useState("");
  const [voterIDErr, setVoterIDErr] = useState("");
  const [passPortErr, setPassPortErr] = useState("");
  const [document, setDocument] = useState("");

console.log(props.hotelId);
  const [guestData, setGuestData] = useState({
    guest_name: "",
    guest_age: "",
    guest_gender: "",
    guest_country: "",
    guest_state: "",
    guest_district: "",
    guest_town: "",
    guest_pincode: "",
    guest_mobile: "",
    document_type: "",
    document_no_field: "",
    check_in: "",
    check_out: "",
    room_no_field: "",
    no_person: "",
    adults: "",
    child: "",
    coming_from: "",
    going_to: "",
    hotel_user_name: props.hotelUserName,
    hotel: props.hotelId,
    // hotel_user_name: "lemon",
    // hotel: props.hotel_id,
    documents: [],
  });
  const [allGeoData, SetAllGeoData] = useState([]);

  const handleInputChange = (e) => {
    try {
      const { id, value } = e.target;
      const PinRegex = /^[0-9]{6}$/;

      if (value.trim() === "") {
        setPinErr("This field is required.");
        setGuestData({ ...guestData, [id]: value });
      } else if (PinRegex.test(value)) {
        setGuestData({ ...guestData, [id]: value });
        setPinErr("");
      } else {
        setPinErr("Please enter a 6-digit numeric PIN.");
        setGuestData({ ...guestData, [id]: value });
      }
      if (id == "guest_pincode" && value.length == 6) {
        setLoading(true);
        const pincodeData = {
          pincode: e.target.value,
        };
        getAllGeoDataGuestReg(pincodeData).then((res) => {
          if (res.Status == "Success") {
            setGeoGuestData(res.PostOffice);
            console.log(res.PostOffice);
            setGuestData((prevData) => ({
              ...prevData,
              guest_country: res.PostOffice[0]?.Country || "",
              guest_district: res.PostOffice[0]?.District || "",
              guest_state: res.PostOffice[0]?.State || "",
            }));
            setLoading(false);
          } else {
            console.log(res);
            setLoading(false);
          }
        });
      }
      setGuestData({ ...guestData, [id]: value });
      console.log(guestData);
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };
  const handleMobile = (e) => {
    const { id, value } = e.target;
    const MobileNumberRegex = /^[0-9]{10}$/;

    if (value.trim() === "") {
      setMobileErr("This field is required.");
      setGuestData({ ...guestData, [id]: value });
    } else if (MobileNumberRegex.test(value)) {
      setGuestData({ ...guestData, [id]: value });
      setMobileErr("");
    } else {
      setMobileErr("Please enter a 10-digit numeric NUmber.");
      setGuestData({ ...guestData, [id]: value });
    }
  };
  const handleGuestName = (e) => {
    const { id, value } = e.target;
    const FirstNameRegex = /^[A-Za-z\s]+$/;

    if (value.trim() === "") {
      setNameErr("This field is required.");
      setGuestData({ ...guestData, [id]: value });
    } else if (FirstNameRegex.test(value)) {
      setGuestData({ ...guestData, [id]: value });
      setNameErr("");
    } else {
      setNameErr("Please enter valid First Name.");
      setGuestData({ ...guestData, [id]: value });
    }
  };
  const handlePan = (e) => {
    const { id, value } = e.target;
    const PanRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

    if (value.trim() === "") {
      setPanErr("This field is required.");
      setGuestData({ ...guestData, [id]: value });
    } else if (PanRegex.test(value)) {
      setGuestData({ ...guestData, [id]: value });
      setPanErr("");
    } else {
      setPanErr("Please enter a valid PAN.");
      setGuestData({ ...guestData, [id]: value });
    }
  };
  const handleAadhar = (e) => {
    const { id, value } = e.target;
    const AadhaarRegex = /^[0-9]{12}$/;

    if (value.trim() === "") {
      setAadharErr("This field is required.");
      setGuestData({ ...guestData, [id]: value });
    } else if (AadhaarRegex.test(value)) {
      setGuestData({ ...guestData, [id]: value });
      setAadharErr("");
    } else {
      setAadharErr("Please enter a valid Aadhar.");
      setGuestData({ ...guestData, [id]: value });
    }
  };
  const handleDL = (e) => {
    const { id, value } = e.target;
    const DrivingLicenseRegex = /^[A-Za-z0-9\- ]+$/;

    if (value.trim() === "") {
      setDLErr("This field is required.");
      setGuestData({ ...guestData, [id]: value });
    } else if (DrivingLicenseRegex.test(value)) {
      setGuestData({ ...guestData, [id]: value });
      setDLErr("");
    } else {
      setDLErr("Please enter a valid Driving License.");
      setGuestData({ ...guestData, [id]: value });
    }
  };
  const handlePassPort = (e) => {
    const { id, value } = e.target;
    const PassportRegex = /^[A-Za-z0-9_]+$/;

    if (value.trim() === "") {
      setPassPortErr("This field is required.");
      setGuestData({ ...guestData, [id]: value });
    } else if (PassportRegex.test(value)) {
      setGuestData({ ...guestData, [id]: value });
      setPassPortErr("");
    } else {
      setPassPortErr("Please enter a valid Pass Port.");
      setGuestData({ ...guestData, [id]: value });
    }
  };
  const handleVoterID = (e) => {
    const { id, value } = e.target;
    const VoterIDRegex = /^[A-Za-z0-9_]+$/;
    if (value.trim() === "") {
      setVoterIDErr("This field is required.");
      setGuestData({ ...guestData, [id]: value });
    } else if (VoterIDRegex.test(value)) {
      setGuestData({ ...guestData, [id]: value });
      setVoterIDErr("");
    } else {
      setVoterIDErr("Please enter a valid Voter ID.");
      setGuestData({ ...guestData, [id]: value });
    }
  };

  const handleDocumentChange = (e) => {
    const { id, value } = e.target;
    setGuestData({ ...guestData, [id]: value });
    setDocument(value);
  };

  const handleImageChange = (e) => {
    setGuestData({ ...guestData, documents: e.target.files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      pinErr ||
      mobileErr ||
      nameErr ||
      panErr ||
      aadharErr ||
      dLErr ||
      voterIDErr ||
      passPortErr
    ) {
      toast.error("Please fill out all required fields correctly.");
      return;
    }
    const formData = new FormData();
    Object.entries(guestData).forEach(([key, value]) => {
      if (key === "documents") {
        Array.from(value).forEach((file) => {
          formData.append("documents", file);
        });
      } else {
        formData.append(key, value);
      }
    });

    addGuest(formData)
      .then((res) => {
        if (res.status === "success") {
          toast.success("Guest Added Successfully");
          setTimeout(() => {
            navigate("/manage-guests");
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
          <h4 className="p-3 pb-0">Add Guest</h4>
        </div>
      </div>
      <div>
        <form
          onSubmit={handleSubmit}
          className="col-12 row d-flex justify-content-start p-5"
        >
          <div className="mb-3 col-3">
            <label className="form-label">
              Guest Name<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              className={`form-control ${nameErr ? "is-invalid" : ""}`}
              id="guest_name"
              value={guestData.guest_name}
              onChange={handleGuestName}
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
              id="guest_age"
              value={guestData.guest_age}
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
              className="form-select"
              id="guest_gender"
              value={guestData.guest_gender}
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
              id="guest_pincode"
              value={guestData.guest_pincode}
              onChange={handleInputChange}
              maxLength={6}
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
              id="guest_country"
              value={geoGuestData[0]?.Country}
              onChange={handleInputChange}
              disabled
            ></input>
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              State<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="guest_state"
              defaultValue={geoGuestData[0]?.State}
              onChange={handleInputChange}
              disabled
            ></input>
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              District<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="guest_district"
              defaultValue={geoGuestData[0]?.District}
              onChange={handleInputChange}
              disabled
            ></input>
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
              defaultValuezl={guestData.guest_town}
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
              id="guest_mobile"
              value={guestData.guest_mobile}
              onChange={handleMobile}
              maxLength={10}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Document Type<span style={{ color: "red" }}>*</span>
            </label>
            <select
              required
              type="text"
              className="form-select"
              id="document_type"
              value={guestData.document_type}
              onChange={handleDocumentChange}
            >
              <option value="">Select Document Type</option>
              <option value="PAN">PAN</option>
              <option value="Aadhar">Aadhar</option>
              <option value="Driving Licence">Driving Licence</option>
              <option value="Passport">Passport</option>
              <option value="Voter ID">Voter ID</option>
            </select>
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Document Number<span style={{ color: "red" }}>*</span>
            </label>
            {document == "" && (
              <input
                required
                type="text"
                className={`form-control ${panErr ? "is-invalid" : ""}`}
                id="document_no_field"
                value={guestData.document_no_field}
              />
            )}
            {document == "PAN" && (
              <input
                required
                type="text"
                className={`form-control ${panErr ? "is-invalid" : ""}`}
                id="document_no_field"
                value={guestData.document_no_field}
                onChange={handlePan}
                maxLength={10}
              />
            )}
            {document == "Aadhar" && (
              <input
                required
                type="text"
                className={`form-control ${aadharErr ? "is-invalid" : ""}`}
                id="document_no_field"
                value={guestData.document_no_field}
                maxLength={12}
                onChange={handleAadhar}
              />
            )}
            {document == "Driving Licence" && (
              <input
                required
                type="text"
                className={`form-control ${dLErr ? "is-invalid" : ""}`}
                id="document_no_field"
                value={guestData.document_no_field}
                onChange={handleDL}
                maxLength={12}
              />
            )}
            {document == "Passport" && (
              <input
                required
                type="text"
                className={`form-control ${passPortErr ? "is-invalid" : ""}`}
                id="document_no_field"
                value={guestData.document_no_field}
                onChange={handlePassPort}
              />
            )}
            {document == "Voter ID" && (
              <input
                required
                type="text"
                className={`form-control ${voterIDErr ? "is-invalid" : ""}`}
                id="document_no_field"
                value={guestData.document_no_field}
                onChange={handleVoterID}
                maxLength={15}
              />
            )}
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Document Image<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="file"
              className="form-control"
              id="upload_docs"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Check-in Date/Time<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="datetime-local"
              className="form-control"
              id="check_in"
              value={guestData.check_in}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Check-out Date/Time<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="datetime-local"
              className="form-control"
              id="check_out"
              value={guestData.check_out}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Room No.<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="room_no_field"
              value={guestData.room_no_field}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              No. of Persons<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="number"
              className="form-control"
              id="no_person"
              value={guestData.no_person}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              No. of Adults<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="number"
              className="form-control"
              id="adults"
              value={guestData.adults}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              No. of Children<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="number"
              className="form-control"
              id="child"
              value={guestData.child}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Coming From<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="coming_from"
              value={guestData.coming_from}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-3">
            <label className="form-label">
              Going To<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="going_to"
              value={guestData.going_to}
              onChange={handleInputChange}
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
