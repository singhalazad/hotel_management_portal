import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../Images/Logo_Guestfolio.jpg";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenTwoToneIcon from "@mui/icons-material/MenuOpenTwoTone";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TroubleshootTwoToneIcon from "@mui/icons-material/TroubleshootTwoTone";
import BeenhereTwoToneIcon from "@mui/icons-material/BeenhereTwoTone";
import NearMeTwoToneIcon from "@mui/icons-material/NearMeTwoTone";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import ArticleTwoToneIcon from "@mui/icons-material/ArticleTwoTone";
import HotelTwoToneIcon from "@mui/icons-material/HotelTwoTone";
import ExitToAppTwoToneIcon from "@mui/icons-material/ExitToAppTwoTone";
import PersonTwoToneIcon from "@mui/icons-material/PersonTwoTone";
import { LuLayoutDashboard } from "react-icons/lu";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Navbar.css";
import { PiUserThin } from "react-icons/pi";
import { PiBellRingingThin } from "react-icons/pi";
import { Modal, TextField, IconButton, Typography } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getNotification, getNotificationUpdate, logoutAPI } from "../API/api";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const ProtectedRouteSystem = ({
  component: Component,
  role,
  allowedRoles,
  hotelId,
  hotelUserName,
  drawer,
}) => {
  if (role) {
    if (allowedRoles.includes(role)) {
      return (
        <div className="App">
          <div className="AppGlass">
            <div className="MainDash mb-4">
              {role === "A" ? (
                <Component role={role} />
              ) : (
                <Component
                  role={role}
                  hotelId={hotelId}
                  hotelUserName={hotelUserName}
                  drawer={drawer}
                />
              )}
            </div>
          </div>
        </div>
      );
    } else {
      return <Navigate to="/" replace={true} />;
    }
  } else {
    return <Navigate to="/" replace={true} />;
  }
};

export default function ProtectedRoute({
  component,
  role,
  allowedRoles,
  hotelId,
  hotelUserName,
  notification,
  count,
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [modal, setModal] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaQueryChange = (e) => {
      if (e.matches) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleNotification = () => {
    setModal(!modal);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const NavigateTo = (link) => {
    navigate(link);
  };

  let data = { refresh_token: sessionStorage.getItem("refresh") };
  let token = sessionStorage.getItem("access");

  console.log("data", data, "token", token);
  const logout = async () => {
    try {
      await logoutAPI(token, data).then((res) => {
        if (res.status === "success") {
          console.log("Logged Out");
          sessionStorage.removeItem("userRole");
          sessionStorage.removeItem("hoteluserName");
          sessionStorage.removeItem("hotelId");
          sessionStorage.removeItem("refresh");
          sessionStorage.removeItem("access");
        }
      });
    } catch (error) {
      console.log(error);
    }
    navigate("/");
  };

  const handleAcknowledge = (num) => {
    const NotId = num;
    try {
      getNotificationUpdate(NotId).then((res) => {
        if (res.status == "success") {
          navigate("/approve-hotels");
        } else {
          console.log(res.status);
        }
      });
    } catch (error) {}
  };
  const handleDismiss = (num) => {
    const NotId = num;
    try {
      getNotificationUpdate(NotId).then((res) => {
        if (res.status == "success") {
          window.location.reload();
        } else {
          console.log(res.status);
        }
      });
    } catch (error) {}
  };
  const links = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: LuLayoutDashboard,
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
      allowedRoles: ["H", "S", "A"],
    },
  ];

  const DrawerList = (
    <Box sx={{ width: "250px" }} role="presentation">
      <div className="mt-4 col-12 d-flex justify-content-center">
        {open ? <img alt="logo" src={logo} height="70px" width="150px" /> : ""}
      </div>
      <List className="mt-4">
        {links
          .filter((item) => item.allowedRoles.includes(role))
          .map((item, index) => {
            const isActive = location.pathname === item.link;

            return (
              <>
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => NavigateTo(item.link)}
                    sx={{
                      backgroundColor: isActive ? "#19abff" : "inherit",
                      "&:hover": {
                        backgroundColor: isActive
                          ? "#19abff"
                          : "rgba(0, 0, 0, 0.04)",
                      },
                      borderTopLeftRadius: "1.6rem",
                      borderBottomLeftRadius: "1.6rem",
                      marginLeft: "0.4rem",
                    }}
                  >
                    <item.icon className="mx-1 fs-2" />
                    <ListItemText primary={item.name} className="mx-2" />
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            );
          })}
        <ListItem disablePadding>
          <ListItemButton onClick={logout} sx={{ marginLeft: "0.4rem" }}>
            <ExitToAppTwoToneIcon className="mx-1 fs-2" />
            <ListItemText primary={"Logout"} className="mx-2" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} className="p-2 navBar">
        <Toolbar className="d-flex justify-content-between">
          {!open ? (
            <>
              <div>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                    marginRight: 5,
                  }}
                >
                  <MenuIcon />
                </IconButton>

                <Link className="navbar-brand" to="#">
                  <img alt="logo" src={logo} height="70px" width="150px" />
                </Link>
              </div>
            </>
          ) : (
            <IconButton
              color="inherit"
              aria-label="close drawer"
              onClick={handleDrawerClose}
            >
              <MenuOpenTwoToneIcon />
            </IconButton>
          )}
          <div className="d-flex justify-content-end">
            <div
              style={{
                borderRadius: "50%",
                height: "21px",
                width: "21px",
                display: "flex",
                justifyContent: "center",
                backgroundColor: "red",
                position: "relative",
                left: "3rem",
                display: role == "A" || role == "S" ? "flex" : "none",
              }}
              onClick={handleNotification}
            >
              {count}
            </div>

            <PiBellRingingThin
              className="me-4"
              style={{
                fontSize: "2.6rem",
                cursor: "pointer",
                display: role == "A" || role == "S" ? "block" : "none",
              }}
              onClick={handleNotification}
            />
            <PiUserThin style={{ fontSize: "2.6rem" }} />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        {!open ? <DrawerHeader /> : ""}
        {DrawerList}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
        <DrawerHeader />
        <br />
        <ProtectedRouteSystem
          component={component}
          role={role}
          allowedRoles={allowedRoles}
          hotelId={hotelId}
          hotelUserName={hotelUserName}
          drawer={open}
        />
      </Box>
      <Modal
        open={modal}
        onClose={handleNotification}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "relative",
            width: 1000,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            mx: "auto",
            my: "15vh",
          }}
        >
          <IconButton
            onClick={handleNotification}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" id="modal-title" sx={{ mb: 2 }}>
            Notifications
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr.no</TableCell>
                  <TableCell>Hotel Name</TableCell>
                  <TableCell>Hotel User Name</TableCell>
                  <TableCell>Hotel City</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Message</TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      display: role == "A" ? "block" : "none",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notification?.map((data, index) => {
                  console.log("Data", data.hotel_name);
                  return (
                    <TableRow key={index}>
                      <TableCell>{data.not_id}</TableCell>
                      <TableCell>{data.hotel_name}</TableCell>
                      <TableCell>{data.hotel_user_name}</TableCell>
                      <TableCell>{data.city}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        This Hotel is Waiting for Approval
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                          mr: 2,
                          display: role == "A" ? "block" : "none",
                        }}
                      >
                        <button
                          className="btn btn-success mx-1"
                          onClick={() => handleAcknowledge(data.not_id)}
                        >
                          Acknowledge
                        </button>
                        <button
                          className="btn btn-danger mx-1"
                          onClick={() => handleDismiss(data.not_id)}
                        >
                          Dismiss
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </Box>
  );
}
