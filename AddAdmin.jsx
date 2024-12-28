import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { addAdmin } from "../API/api";

export default function AddAdmin() {
  const navigate = useNavigate(); // Move the hook call inside the component body
  const [adminData, setAdminData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    mobile: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setAdminData({ ...adminData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      username: adminData.username,
      mobile: adminData.mobile,
      email: adminData.email,
      first_name: adminData.first_name,
      last_name: adminData.last_name,
    };

    addAdmin(postData)
      .then((res) => {
        if (res.status === "success") {
          toast.success("admin Added Successfully");
          setTimeout(() => {
            navigate("/admin-list");
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!");
      });
  };

  useEffect(() => {
    console.log(adminData);
  }, [adminData]);

  return (
    <div className="mainDiv col-12"  >
      <div className="col-12 form-container px-5 mt-4">
        <h4 className="px-5 mt-4">Add Admin</h4>
        <form
          onSubmit={handleSubmit}
          className="col-12 row d-flex justify-content-center px-5 mt-4"
        >
          <div className="mb-3 col-7">
            <label className="form-label">
              First Name<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="first_name"
              value={adminData.first_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-7">
            <label className="form-label">
              Last Name<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="last_name"
              value={adminData.last_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-7">
            <label className="form-label">
              Username<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="text"
              className="form-control"
              id="username"
              value={adminData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-7">
            <label className="form-label">
              Mobile No.<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="number"
              className="form-control"
              id="mobile"
              value={adminData.mobile}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3 col-7">
            <label className="form-label">
              Email<span style={{ color: "red" }}> *</span>
            </label>
            <input
              required
              type="email"
              className="form-control"
              id="email"
              value={adminData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-7 mt-3 mx-5 d-flex align-items-end justify-content-center">
            <Button type="submit" className="col-3" variant="contained">
              Add
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
