import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Avatar, Button, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import "jspdf-autotable";
import {getGuestsData } from "../API/api";
import PersonAddAlt1TwoToneIcon from "@mui/icons-material/PersonAddAlt1TwoTone";
import PhotoTwoToneIcon from "@mui/icons-material/PhotoTwoTone";
import '../index.css';
import '../Pages/ManageGuests.css';
import Spin from "../components/loaders/Spin";



export default function GuestsListReports(props, drawer) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hotelsData, setHotelsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHotelsData();
  }, []);

  const getHotelsData = () => {
    setLoading(true);
  
    if (props.hotelUserName !== "admin" && props.hotelUserName !="") {
      getGuestsData(props.hotelUserName)
        .then((res) => {
          setHotelsData(res?.guests);
        })
        .catch((err) => {
          console.error("Error fetching guest data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const username = ""; 
      getGuestsData(username)
        .then((res) => {
          setHotelsData(res?.guests);
        })
        .catch((err) => {
          console.error("Error fetching guest data:", err);
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

  const filteredHotels = hotelsData?.filter((hotel) =>
    Object.keys(hotel).some((key) =>
      hotel[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const navigate = useNavigate();

  const NavigateTo = () => {
    navigate("/add-guest");
  };

  return (
    <div className="mainDiv container-fluid" style={{width:drawer?"auto":"80vw"}}>

      <div className="col-md-12 d-flex justify-content-between headerBar">
          <div className="col-md-12 d-flex justify-content-between headerBar2">
          <div className="d-flex justify-content-end align-items-center px-3">
          <h4 className="px-5">Manage Guests</h4>
        </div>

        <div className="d-flex justify-content-end align-items-center px-5">
          <Button
            variant="contained"
            onClick={NavigateTo}
            startIcon={<PersonAddAlt1TwoToneIcon />}
          >
            Add Guest
          </Button>
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
        <Paper sx={{ width: props.drawer?"78vw":"90vw" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Sr No.</TableCell>
                  <TableCell align="left">Guest Name</TableCell>
                  <TableCell align="left">Age</TableCell>
                  <TableCell align="left">Gender</TableCell>
                  <TableCell align="left">Country</TableCell>
                  <TableCell align="left">State</TableCell>
                  <TableCell align="left">District</TableCell>
                  <TableCell align="left">Pincode</TableCell>
                  <TableCell align="left">Contact No.</TableCell>
                  <TableCell align="left">Document Type</TableCell>
                  <TableCell align="left">Document ID</TableCell>
                  <TableCell align="left">Document Image</TableCell>
                  <TableCell align="left">Check-in Date/Time</TableCell>
                  <TableCell align="left">Check-out Date/Time</TableCell>
                  <TableCell align="left">Room No.</TableCell>
                  <TableCell align="left">No. of Persons</TableCell>
                  <TableCell align="left">No. of Adults</TableCell>
                  <TableCell align="left">No. of Children</TableCell>
                  <TableCell align="left">Coming From</TableCell>
                  <TableCell align="left">Going To</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHotels?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{row.guest_name}</TableCell>
                      <TableCell align="left">{row.guest_age}</TableCell>
                      <TableCell align="left">{row.guest_gender}</TableCell>
                      <TableCell align="left">{row.guest_country}</TableCell>
                      <TableCell align="left">{row.guest_state}</TableCell>
                      <TableCell align="left">{row.guest_district}</TableCell>
                      <TableCell align="left">{row.guest_pincode}</TableCell>
                      <TableCell align="left">{row.guest_mobile}</TableCell>
                      <TableCell align="left">{row.document_type}</TableCell>
                      <TableCell align="left">
                        {row?.document_no_field}
                      </TableCell>
                      <TableCell align="left" className="d-flex">
                        {row?.documents?.length === 0 ? (
                          <>
                            <Avatar>
                              <PhotoTwoToneIcon />
                            </Avatar>
                            <p className="px-1">Image not available</p>
                          </>
                        ) : (
                          row.documents.map((image) => (
                            <Link to={image.document} target="_blank">
                              <img
                                className="bg-white"
                                alt=""
                                src={image.document}
                                style={{
                                  height: "50px",
                                  width: "50px",
                                  borderRadius: "50%",
                                  marginRight: "-20px",
                                  border: "2px solid white",
                                  boxShadow: "0px 0px 5px black",
                                }}
                              />
                            </Link>
                          ))
                        )}
                      </TableCell>
                      <TableCell align="left">{row.check_in}</TableCell>
                      <TableCell align="left">{row.check_out}</TableCell>
                      <TableCell align="left">{row.room_no_field}</TableCell>
                      <TableCell align="left">{row.no_person}</TableCell>
                      <TableCell align="left">{row.adults}</TableCell>
                      <TableCell align="left">{row.child}</TableCell>
                      <TableCell align="left">{row.coming_from}</TableCell>
                      <TableCell align="left">{row.going_to}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredHotels?.length}
            rowsPerPage={rowsPerPage}
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
