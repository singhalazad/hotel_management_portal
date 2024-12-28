import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Avatar, Button, MenuItem, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getDistricts, getStates, get_guests } from "../../API/api";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { RangeDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import PhotoTwoToneIcon from "@mui/icons-material/PhotoTwoTone";
import Spin from "../../components/loaders/Spin";


export default function GuestsListReports() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hotelsData, setHotelsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [states, setStates] = useState([]);
  const [state, setState] = useState("");
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [haryanaDistricts, setHaryanaDistricts] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [base64Images, setBase64Images] = useState([]);
  const [loading, setLoading] = useState(false);



  const [filters, setFilters] = useState({
    guest_state: "All",
    guest_name: "",
    guest_mobile: "",
    guest_district: "",
    hotel_name: "",
    district: "",
    document_no_field: "",
    check_in: "",
    check_out: "",
  });

  useEffect(() => {
    getGuestsData();
    getStatesData();
    getHaryanaDistricts();
  }, []);

  const getGuestsData = () => {setLoading(true);
    get_guests(filters)
      .then((res) => {
        
          setHotelsData(res);
          setLoading(false);
        
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getStatesData = () => {
    getStates()
      .then((res) => {
        setStates(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDistrictsData = (state) => {
    getDistricts(state)
      .then((res) => {
        setDistricts(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getHaryanaDistricts = () => {
    getDistricts(1)
      .then((res) => {
        setHaryanaDistricts(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setState(stateId);

    const selectedState = states.find(
      (state) => state.id === parseInt(stateId)
    );
    const stateName = selectedState ? selectedState.state_name : "";

    setFilters((prevFilters) => ({
      ...prevFilters,
      guest_state: stateName,
    }));

    getDistrictsData(stateId);
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setDistrict(districtId);

    const selectedDistrict = districts.find(
      (district) => district.id === parseInt(districtId)
    );
    const districtName = selectedDistrict ? selectedDistrict.district_name : "";

    setFilters((prevFilters) => ({
      ...prevFilters,
      guest_district: districtName,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const filteredHotels = hotelsData.filter((hotel) =>
    Object.keys(hotel).some((key) =>
      hotel[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  useEffect(() => {
    const imageData = hotelsData.flatMap(row => row.documents.map(image => image));
  
    const validImages = imageData.filter(i => i.document !== "[object][object]");
  
    const convertToBase64 = (url) => {
      return fetch(url.document)
        .then(response => response.blob())
        .then(blob => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              resolve(reader.result);
            };
            reader.onerror = (error) => {
              reject(error);
            };
          });
        });
    };
  
    const getBase64Images = async () => {
      const base64Promises = validImages.map(image => convertToBase64(image));
      const base64Results = await Promise.all(base64Promises);
      setBase64Images(base64Results);
    };
  
    getBase64Images();
  }, [hotelsData]);


  

  
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
    });
  
    const calculateRowHeight = (images) => {
      if (!images || images.length === 0) return 20; // Default row height if no images
      const imgWidth = 25;
      const imgHeight = imgWidth * 0.75;
      const rows = Math.ceil(images.length / 4); // Assuming 4 images per row
      return rows * imgHeight + 4; // Adding some padding
    };
  
    const tableData = filteredHotels.map((row, index) => [
      index + 1,
      row.hotel.hotel_user_name,
      row.hotel.hotel_name,
      row.hotel.state,
      row.hotel.city,
      row.hotel.mobile,
      row.guest_name,
      row.age,
      row.gender,
      row.country,
      row.state,
      row.district,
      row.pincode,
      row.mobile,
      row.document_type,
      row.document_no_field,
      row.check_in,
      row.check_out,
      row.room_no_field,
      
    ]);
  
    const tableStyles = {
      startY: 20,
      margin: { top: 10, left: 10, right: 10, bottom: 10 },
      styles: { cellPadding: 2, fontSize: 4, valign: 'middle' },
      headStyles: { fillColor: [100, 100, 100] },
      columnStyles: { 0: { cellWidth: 'auto' }, 19: { cellWidth: 25 } }, 
    };
  
    const head = [
      [
        'Sr No.',
        'Hotel ID',
        'Hotel Name',
        'State',
        'City',
        'Contact No.',
        'Guest Name',
        'Age',
        'Gender',
        'Country',
        'State',
        'District',
        'Pincode',
        'Contact No.',
        'Document Type',
        'Document ID',
        'Check-in Date/Time',
        'Check-out Date/Time',
        'Room No.',
        'Image'
      ],
    ];
  
    const rowHeights = base64Images.map((image) => {
      return image ? 40 : 40;
    });
  
    doc.autoTable({
      head,
      body: tableData,
      ...tableStyles,
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 19) {
          const rowIndex = data.row.index; 
          const image = base64Images[rowIndex]; 
          if (image) {
            const imgWidth = Math.min(25, data.cell.width - 4); 
            const imgHeight = 8; 
            const startX = data.cell.x + (data.cell.width - imgWidth) / 2; 
            const startY = data.cell.y; 
            doc.addImage(image, 'JPEG', startX, startY, imgWidth, imgHeight);
          }
        }
      },
      rowPageBreak: 'auto', 
      willDrawCell: (data) => {
        if (data.section === 'body') {
          const rowIndex = data.row.index;
          const height = rowHeights[rowIndex];
          doc.setLineHeightFactor(height / data.cell.height); 
          data.cell.height = 20; // Set the cell height
        }
      },
      didParseCell: (data) => {
        if (data.section === 'body') {
          const rowIndex = data.row.index;
          data.cell.styles.cellHeight = rowHeights[rowIndex]; 
        }
      }
    });
  
    doc.save('guests_list_report.pdf');
  };
  
  
  
  
  
  
  
  
  

  const handleDownloadExcel = () => {
    // Define the columns for Excel
    const columns = [
      "Sr No.",
      "Hotel ID",
      "Hotel Name",
      "Hotel Address",
      "State",
      "District",
      "City",
      "Pincode",
      "Contact No.",
      "Email",
      "Owner First Name",
      "Owner Last Name",
      "Owner Address",
      "Owner State",
      "Owner District",
      "Owner City",
      "Owner Pincode",
      "Guest Name",
      "Age",
      "Gender",
      "Country",
      "State",
      "District",
      "Pincode",
      "Contact No.",
      "Document Type",
      "Document ID",
      "Document Image",
      "Check-in Date/Time",
      "Check-out Date/Time",
      "Room No.",
      "No. of Persons",
      "No. of Adults",
      "No. of Children",
      "Coming From",
      "Going To",
    ];

    // Extract data for Excel
    const data = filteredHotels.map((row, index) => [
      index + 1,
      row.hotel.hotel_user_name,
      row.hotel.hotel_name,
      row.hotel.hotel_address,
      row.hotel.state,
      row.hotel.district,
      row.hotel.city,
      row.hotel.pincode,
      row.hotel.mobile,
      row.hotel.email,
      row.hotel.owner_first_name,
      row.hotel.owner_last_name,
      row.hotel.owner_house_address,
      row.hotel.owner_state,
      row.hotel.owner_district,
      row.hotel.owner_city,
      row.hotel.owner_pincode,
      row.guest_name,
      row.age,
      row.gender,
      row.country,
      row.state,
      row.district,
      row.pincode,
      row.mobile,
      row.document_type,
      row.document_no_field,
      row.documents.map((image) => (
        <img
          alt=""
          src={image.document}
          style={{
            height: "50px",
            width: "50px",
            borderRadius: "50%",
          }}
        />
      )),
      row.check_in,
      row.check_out,
      row.room_no_field,
      row.no_person,
      row.adults,
      row.child,
      row.coming_from,
      row.going_to,
    ]);

    // Create a new Excel workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([columns, ...data]);
    XLSX.utils.book_append_sheet(wb, ws, "Guests List");

    // Apply basic styling to the header row
    const headerCellStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "FF0000" } }, // Header background color
    };
    XLSX.utils.sheet_add_json(ws, [], { header: columns, origin: "A1" });
    for (let i = 0; i < columns.length; i++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
      ws[cellAddress].s = headerCellStyle;
    }

    // Add data to the sheet
    XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: "A2" });

    // Save Excel file
    XLSX.writeFile(wb, "guests_list_report.xlsx");
  };

  const onDateChange = (startDate, endDate) => {
    // Check if startDate and endDate are valid Date objects
    if (
      startDate instanceof Date &&
      !isNaN(startDate) &&
      endDate instanceof Date &&
      !isNaN(endDate)
    ) {
      // Format startDate and endDate to "YYYY-MM-DD" format using date-fns
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");

      console.log("start: ", formattedStartDate);
      console.log("end: ", formattedEndDate);

      setFilters((old) => ({
        ...old,
        check_in: formattedStartDate,
        check_out: formattedEndDate,
      }));
    } else {
      console.error("Invalid startDate or endDate");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFilters({ ...filters, [id]: value });
  };

  const handleHotelDistrictChange = (e) => {
    setFilters({ ...filters, district: e.target.value });
  };

  return (
    <div className="row col-sm-12 mainDiv d-flex justify-content-center">
      <div className="d-flex col-sm-12 justify-content-between">
        <div className="d-flex justify-content-end align-items-center px-3">
          <h4 className="px-5">Guests List Report</h4>
        </div>
        <div className="d-flex justify-content-end align-items-center px-5">
          <div className="col-6">
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
            <span className="mx-2"></span>
            <Button
              variant="contained"
              color="success"
              onClick={handleDownloadExcel}
            >
              Download Excel
            </Button>
          </div>
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

      <div className="col-11 p-4 d-flex justify-content-between align-items-center">
        <div className="col-12 row">
          <div className="col-2">
            <TextField
              className="col-12"
              id="state"
              select
              label="Guest State"
              defaultValue=""
              variant="filled"
              onChange={handleStateChange}
            >
              <MenuItem value={"All"}>All</MenuItem>
              {states.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.state_name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="col-2">
            <TextField
              className="col-12"
              id="district"
              select
              label="Guest District"
              defaultValue=""
              variant="filled"
              onChange={handleDistrictChange}
            >
              <MenuItem value={""}>All</MenuItem>
              {districts.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.district_name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="col-2">
            <TextField
              id="guest_name"
              label="Guest Name"
              variant="outlined"
              onChange={handleInputChange}
            />
          </div>
          <div className="col-2">
            <TextField
              id="guest_mobile"
              label="Guest Mobile"
              variant="outlined"
              onChange={handleInputChange}
              type="number"
            />
          </div>
          <div className="col-2">
            <TextField
              id="document_no_field"
              label="Document No."
              variant="outlined"
              onChange={handleInputChange}
              type="number"
            />
          </div>
          <div className="col-2">
            <TextField
              className="col-12"
              id="hotel_district"
              select
              label="Hotel District"
              defaultValue=""
              variant="filled"
              onChange={handleHotelDistrictChange}
            >
              <MenuItem value={""}>All</MenuItem>
              {haryanaDistricts.map((option) => (
                <MenuItem key={option.id} value={option.district_name}>
                  {option.district_name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="col-2 mt-2">
            <TextField
              id="hotel_name"
              label="Hotel Name"
              variant="outlined"
              onChange={handleInputChange}
            />
          </div>
          <div className="col-5 mt-1">
            <RangeDatePicker
              startDate={filters.check_in}
              endDate={filters.check_out}
              onChange={(startDate, endDate) =>
                onDateChange(startDate, endDate)
              }
              // minDate={new Date(1900, 0, 1)}
              // maxDate={new Date()}
              dateFormat="DD/MM/YYYY"
              monthFormat="MMM/YYYY"
              startDatePlaceholder="Start Date"
              endDatePlaceholder="End Date"
              disabled={false}
              className="my-own-class-name"
              startWeekDay="monday"
            />
          </div>
          <div className="col-2 mt-3 mx-2">
            <Button variant="contained" onClick={getGuestsData}>
              Filter
            </Button>
          </div>
        </div>
      </div>
      <div className="table d-flex justify-content-center p-0">
        <Paper sx={{ width: "75vw"}}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table" id="table">
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
                {filteredHotels.slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">{row.hotel.hotel_name}</TableCell>
                      <TableCell align="left">
                        {row.hotel.hotel_address}
                      </TableCell>
                      <TableCell align="left">{row.hotel.state}</TableCell>
                      <TableCell align="left">{row.hotel.district}</TableCell>
                      <TableCell align="left">{row.hotel.city}</TableCell>
                      <TableCell align="left">{row.hotel.pincode}</TableCell>
                      <TableCell align="left">{row.hotel.mobile}</TableCell>
                      <TableCell align="left">{row.hotel.email}</TableCell>
                      <TableCell align="left">
                        {row.hotel.owner_first_name}
                      </TableCell>
                      <TableCell align="left">
                        {row.hotel.owner_last_name}
                      </TableCell>
                      <TableCell align="left">
                        {row.hotel.owner_house_address}
                      </TableCell>
                      <TableCell align="left">
                        {row.hotel.owner_state}
                      </TableCell>
                      <TableCell align="left">
                        {row.hotel.owner_district}
                      </TableCell>
                      <TableCell align="left">{row.hotel.owner_city}</TableCell>
                      <TableCell align="left">
                        {row.hotel.owner_pincode}
                      </TableCell>
                      <TableCell align="left">{row.guest_name}</TableCell>
                      <TableCell align="left">{row.age}</TableCell>
                      <TableCell align="left">{row.gender}</TableCell>
                      <TableCell align="left">{row.country}</TableCell>
                      <TableCell align="left">{row.state}</TableCell>
                      <TableCell align="left">{row.district}</TableCell>
                      <TableCell align="left">{row.pincode}</TableCell>
                      <TableCell align="left">{row.mobile}</TableCell>
                      <TableCell align="left">{row.document_type}</TableCell>
                      <TableCell align="left">
                        {row.document_no_field}
                      </TableCell>
                      <TableCell align="left" className="d-flex">
                        {row.documents.length === 0 ? (
                          <Avatar>
                            <PhotoTwoToneIcon />
                          </Avatar>
                        ) : (
                          row.documents.map((image) => (
                            <Link to={image.document} target="_blank">
                              <img
                                alt=""
                                src={image.document}
                                style={{
                                  height: "50px",
                                  width: "50px",
                                  borderRadius: "50%",
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
