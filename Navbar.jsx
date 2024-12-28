import { IconButton } from "@mui/material";
import * as React from "react";
import { Link } from "react-router-dom";
import TemporaryDrawer from "../sidebaryDrawer";
import logo from "../../Images/Logo_Guestfolio.jpg";
// import { Image } from "@mui/icons-material";

export default function Navbar({ role }) {
  return (
    <div className="col-12">
    
    <nav className="navbar navbar-expand-lg bg-body-light">
      <div className="container-fluid">
        {/* <IconButton
          size="large"
          edge="start"
          // color="black"
          aria-label="menu"
          sx={{ mr: 5, ml: 3 }}
        > */}
        <div className="mx-4" style={{cursor: "pointer"}}>
          <TemporaryDrawer role={role} />
        </div>
        {/* </IconButton> */}

        <div className="collapse navbar-collapse" id="navbarSupportedContent" >
          <div>
            <Link className="navbar-brand" to="#" >
              <img alt="logo" src={logo} height="70px" width="150px" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
    </div>
  );
}
