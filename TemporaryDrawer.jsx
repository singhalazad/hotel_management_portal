import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close"; 
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../Images/Logo_Guestfolio.jpg";
import TroubleshootTwoToneIcon from "@mui/icons-material/TroubleshootTwoTone";
import HotelTwoToneIcon from "@mui/icons-material/HotelTwoTone";
import BeenhereTwoToneIcon from "@mui/icons-material/BeenhereTwoTone";
import PersonTwoToneIcon from "@mui/icons-material/PersonTwoTone";
import ArticleTwoToneIcon from "@mui/icons-material/ArticleTwoTone";
import NearMeTwoToneIcon from '@mui/icons-material/NearMeTwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import ExitToAppTwoToneIcon from "@mui/icons-material/ExitToAppTwoTone";

export default function TemporaryDrawer({ role }) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const links = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: TroubleshootTwoToneIcon,
      allowedRoles: ["A", "H", "S"],
    },
    {
      name: "View Hotels",
      link: "/view-hotels",
      icon: HotelTwoToneIcon,
      allowedRoles: ["A", "S"],
    },
    {
      name: "Approve Hotels",
      link: "/approve-hotels",
      icon: BeenhereTwoToneIcon,
      allowedRoles: ["A"],
    },
    {
      name: "Manage Guests",
      link: "/manage-guests",
      icon: PersonTwoToneIcon,
      allowedRoles: ["H"],
    },
    {
      name: "View Guests report",
      link: "/guest-reports",
      icon: ArticleTwoToneIcon,
      allowedRoles: ["A", "S"],
    },
    {
      name: "Track Guest",
      link: "/track-guest",
      icon: NearMeTwoToneIcon,
      allowedRoles: ["A", "S"],
    },
    {
      name: "Manage Admins",
      link: "/admin-list",
      icon: ManageAccountsTwoToneIcon,
      allowedRoles: ["S"],
    },
    {
      name: "Manage Staff",
      link: "/staff-list",
      icon: ManageAccountsTwoToneIcon,
      allowedRoles: ["H"],
    },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const NavigateTo = (link) => {
    navigate(link);
  };

  const logout = () => {
    sessionStorage.removeItem("userRole");
    navigate("/");
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <div className="mt-4 col-12 d-flex justify-content-center">
        <img alt="logo" src={logo} height="70px" width="150px" />
      </div>
      <List className="mt-4">
        {links
          .filter((item) => item.allowedRoles.includes(role))
          .map((item, index) => {
            const isActive = location.pathname === item.link;
            return (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => NavigateTo(item.link)}
                  
                >
                  <item.icon className="mx-2" />
                  <ListItemText primary={item.name} 
                  sx={{
                    backgroundColor: isActive ? 'lightblue' : 'inherit',
                    '&:hover': {
                      backgroundColor: isActive ? 'lightblue' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}/>
                </ListItemButton>
              </ListItem>
            );
          })}
        <ListItem disablePadding>
          <ListItemButton onClick={logout}>
            <ExitToAppTwoToneIcon className="mx-2" />
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <MenuIcon onClick={toggleDrawer(true)} />
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <CloseIcon
          onClick={toggleDrawer(false)}
          style={{ position: "absolute", marginLeft: '14rem', marginTop: '10px' }}
        />
        {DrawerList}
      </Drawer>
    </div>
  );
}
