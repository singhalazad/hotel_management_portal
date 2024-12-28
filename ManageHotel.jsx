import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { getAllHotels } from "../API/api";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import Spin from "../components/loaders/Spin";


export default function ManageHotel() {
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
    getAllHotels()
      .then((res) => {
        setHotelsData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredHotels = hotelsData.filter((hotel) =>
    ["hotel_name", "hotel_address", "state", "city"].some((key) =>
      hotel[key]?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const navigate = useNavigate();

  const NavigateTo = () => {
    navigate("/add-hotel");
  };

  return (
    <div className="mainDiv container-fluid" style={{}}>
      <div className="col-12 d-flex justify-content-between">
        <div className="d-flex justify-content-end align-items-center px-5">
          <h4 className="px-5">All Hotels</h4>
        </div>
        <div className="d-flex justify-content-end align-items-center px-5">
          <div className="mb-3 px-4">
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
                  <TableCell align="left">Hotel Name</TableCell>
                  <TableCell align="left">Hotel Address</TableCell>
                  <TableCell align="left">State</TableCell>
                  <TableCell align="left">District</TableCell>
                  <TableCell align="left">City</TableCell>
                  <TableCell align="left">Pincode</TableCell>
                  <TableCell align="left">Contact No.</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Owner First Name</TableCell>
                  <TableCell align="left">Owner Last Name</TableCell>
                  <TableCell align="left">Owner Address</TableCell>
                  <TableCell align="left">Owner State</TableCell>
                  <TableCell align="left">Owner District</TableCell>
                  <TableCell align="left">Owner City</TableCell>
                  <TableCell align="left">Owner Pincode</TableCell>
                  {/* <TableCell align="left">Action</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHotels
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{row.hotel_name}</TableCell>
                      <TableCell align="left">{row.hotel_address}</TableCell>
                      <TableCell align="left">{row.state}</TableCell>
                      <TableCell align="left">{row.district}</TableCell>
                      <TableCell align="left">{row.city}</TableCell>
                      <TableCell align="left">{row.pincode}</TableCell>
                      <TableCell align="left">{row.mobile}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.owner_first_name}</TableCell>
                      <TableCell align="left">{row.owner_last_name}</TableCell>
                      <TableCell align="left">
                        {row.owner_house_address}
                      </TableCell>
                      <TableCell align="left">{row.owner_state}</TableCell>
                      <TableCell align="left">{row.owner_district}</TableCell>
                      <TableCell align="left">{row.owner_city}</TableCell>
                      <TableCell align="left">{row.owner_pincode}</TableCell>
                      {/* <TableCell align="left">
                        <Button variant="contained">Edit</Button>
                      </TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredHotels.length}
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
