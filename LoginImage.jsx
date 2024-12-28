import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./API/api";
import logo from "./Images/Logo_Guestfolio.jpg";
import footer from "./Images/bgImage.png";
import hplogo from "./Images/haryana-plice-logo-BC5F526ACF-seeklogo.com.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import Spin from "./components/loaders/Spin";

const App = ({ fetchRole }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
    emailOrMobile: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("userRole");
  }, []);

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      username: formData.emailOrMobile,
      password: formData.password,
    };
    try {
      await login(data)
        .then((res) => {
          if (res.status === 200) {
            if (res.role === formData.role) {
              fetchRole(res.role, res.hotel_id, res.username);
              sessionStorage.setItem("access", res.token.access);
              sessionStorage.setItem("refresh", res.token.refresh);

              navigate("/dashboard");
            } else {
              toast.warn("Enter a valid role");
            }
          } else {
            toast.error("Something went wrong!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(
        "An error occurred while submitting data. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex row col-12 m-0">
      <nav className="navbar navbar-expand-lg bg-body-light">
        <div className="container-fluid">
          <Link className="navbar-brand p-2" to="/">
            <img alt="HP logo" src={hplogo} style={{ height: "4rem" }} />
          </Link>
        </div>
      </nav>
      <div className="row flex-grow-1 d-flex justify-content-center align-items-center maindivLogin">
        <div className="col-7 p-5 imgLogin">
          <img
            className="rounded imgLogin"
            src="LoginImage.png"
            alt="loginNew"
          />
        </div>
        <div className="col-4 custom-col">
          <div className="loginForm p-4 my-1">
            <div className="text-center d-flex justify-content-center align-items-center ">
              <img alt="logo" src={logo} style={{ height: "4rem" }} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group mt-3">
                <label className="form-label">
                  Role <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  name="role"
                  className="form-control"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="S">Super Admin</option>
                  <option value="A">Admin</option>
                  <option value="H">Hotel</option>
                </select>
              </div>
              <div className="form-group mt-3">
                <label className="form-label">
                  Username <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  name="emailOrMobile"
                  className="form-control"
                  value={formData.emailOrMobile}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group mt-3">
                <label className="form-label">
                  Password <span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                  <input
                    required
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={togglePassword}
                  >
                    {passwordVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-4 w-100"
                >
                  Login
                </button>
              </div>
              <div className="mt-2 text-center d-flex justify-content-end">
                <Link to="/Add-Hotel" className="text-primary mx-3">
                  Register New Hotel
                </Link>
                <Link to="/forgotpassword" className="text-danger">
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="col-12 footer mt-3 m-0 p-0">
        <img
          className="col-12"
          alt="footer"
          src={footer}
          style={{ height: "6rem" }}
        />
      </div>
      <ToastContainer position="top-center" />
      <Spin open={loading} />
    </div>
  );
};

export default App;
