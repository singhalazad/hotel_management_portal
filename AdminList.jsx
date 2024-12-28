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
import { admin_list } from "../API/api";
import PersonAddAlt1TwoToneIcon from "@mui/icons-material/PersonAddAlt1TwoTone";


export default function AdminList() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [adminsData, setAdminsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        getAdminsData();
    }, []);

    const getAdminsData = () => {
        admin_list()           //API
            .then((res) => {
                setAdminsData(res.response);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const filteredAdmins = adminsData.filter((admin) =>
        Object.keys(admin).some((key) =>
            admin[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const navigate = useNavigate();

    const NavigateTo = () => {
        navigate("/add-admin");
    };

    return (
        <div className="mainDiv">
            <div className="col-12 d-flex justify-content-between">
                <div className="d-flex justify-content-end align-items-center px-3">
                    <h4 className="px-5">Manage Admins</h4>
                </div>

                <div className="d-flex justify-content-end align-items-center px-5">
                    <Button
                        variant="contained"
                        onClick={NavigateTo}
                        startIcon={<PersonAddAlt1TwoToneIcon />}
                    >
                        Add Admin
                    </Button>
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
                                    <TableCell align="left">Username</TableCell>
                                    <TableCell align="left">First Name</TableCell>
                                    <TableCell align="left">Last Name</TableCell>
                                    <TableCell align="left">Mobile no.</TableCell>
                                    <TableCell align="left">Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAdmins
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                            <TableCell align="left">{index + 1}</TableCell>
                                            <TableCell align="left">
                                                {row.username}
                                            </TableCell>
                                            <TableCell align="left">{row.first_name}</TableCell>
                                            <TableCell align="left">
                                                {row.last_name}
                                            </TableCell>
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
                        count={filteredAdmins.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        </div>
    );
}

