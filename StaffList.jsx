import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { toast } from "react-toastify";
import { Button, MenuItem, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { Select } from "@mui/material";
import { admin_list, getHotelStaffData, getHotelStaffDataBYAdmin } from "../API/api";
import PersonAddAlt1TwoToneIcon from "@mui/icons-material/PersonAddAlt1TwoTone";
import "../Pages/StaffList.css";
import Spin from "../components/loaders/Spin";

export default function StaffList(drawer) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [adminsData, setAdminsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(
    sessionStorage.getItem("userRole") ? sessionStorage.getItem("userRole") : ""
  );
  const [hotelName, setHotelName] = useState(
    sessionStorage.getItem("hoteluserName")
      ? sessionStorage.getItem("hoteluserName")
      : ""
  );

  useEffect(() => {
    getHotelStaffDetails();
  }, []);

  // const getAdminsData = () => {
  //   setLoading(true);
  //   admin_list()
  //     .then((res) => {
  //       setAdminsData(res.response);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };
  const getHotelStaffDetails = () => {
    setLoading(true);

    if (hotelName !== "admin" && hotelName !== "admin_austere") {
      getHotelStaffData(hotelName)
        .then((res) => {
          setAdminsData(res);
        })
        .catch((err) => {
          console.error("Error fetching staff data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      getHotelStaffDataBYAdmin()
        .then((res) => {
          setAdminsData(res);
        })
        .catch((err) => {
          console.error("Error fetching staff data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const navigate = useNavigate();

  const NavigateTo = () => {
    navigate("/add-staff");
  };

  return (
    <div
      className="mainDiv container-fluid"
      style={{ width: drawer ? "auto" : "80vw" }}
    >
      <div className="col-md-12 d-flex justify-content-between headerBar">
        <div className="col-md-12 d-flex justify-content-between headerBar2">
          <div className="d-flex justify-content-end align-items-center px-3">
            <h4 className="px-5">Manage Staff</h4>
          </div>

          <div className="d-flex justify-content-end align-items-center px-5">
            {role == "H" && (
              <Button
                variant="contained"
                onClick={NavigateTo}
                startIcon={<PersonAddAlt1TwoToneIcon />}
              >
                Add Staff
              </Button>
            )}
          </div>
          <div className="mb-3 px-4 searchBut">
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon />,
              }}
              style={{
                display: "flex",
                marginLeft: "3rem",
                width: "17rem",
                borderRadius: "35px",
                marginTop: "20px",
              }}
            />
          </div>
        </div>
      </div>
      <div className="table d-flex justify-content-center">
        <Paper sx={{ width: "75vw" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Sr No.</TableCell>
                  <TableCell align="left">Position</TableCell>
                  <TableCell align="left"> Name</TableCell>
                  <TableCell align="left">Hotel Name</TableCell>
                  <TableCell align="left">Mobile no.</TableCell>
                  <TableCell align="left">Email</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {adminsData &&
                  adminsData.map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{row.position}</TableCell>
                      <TableCell align="left">{row.staff_name}</TableCell>
                      <TableCell align="left">{row.hotel_name}</TableCell>
                      <TableCell align="left">{row.mobile}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            rowsPerPage={rowsPerPage}
            count={adminsData?.length}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
      <Spin open={loading} />
    </div>
  );
}
