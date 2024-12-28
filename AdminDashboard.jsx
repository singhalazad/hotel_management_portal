import React, { useEffect, useState, useRef } from "react";
import Map from "../Map/Map";
import {
  getCardsData,
  getCardsDataAll,
  getGuestKPI,
  getHotelKPI,
  getLongStaysData,
  getMapData,
  getOutstateGuest,
  getYearlyHotelsData,
} from "../../API/api";
import { RangeDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import { format } from "date-fns";
import { Button } from "@mui/material";
import "../Dashboards/AdminDashBoard.css";
import { RiHotelLine } from "react-icons/ri";
import {
  FaPeopleRobbery,
  FaPersonWalkingDashedLineArrowRight,
} from "react-icons/fa6";
import { ImManWoman } from "react-icons/im";
import { MdOutlineMan4 } from "react-icons/md";
import { GiPlanetConquest } from "react-icons/gi";
import { RiMapPinTimeLine } from "react-icons/ri";
import { BsGraphUpArrow } from "react-icons/bs";
import { Navigate, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import variablePie from "highcharts/modules/variable-pie";
import * as echarts from "echarts";
import KPIChart from "../Dashboards/KPIChart";

export default function AdminDashboard(hotelUserName) {
  const [mapData, setMapData] = useState([]);
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [cardData, setCardsData] = useState([]);
  const [longStaysData, setLongStaysData] = useState([]);
  const [hotelKPI, setHotelKPI] = useState([]);
  const [guestKPI, setGuestKPI] = useState("");
  const [totalGuest, setTotalGuest] = useState("");
  const [outstateGuests, setOutstateGuests] = useState([]);
  const [yearlyTopHotels, setYearlyTopHotels] = useState([]);
  const [year, setYear] = useState([]);
  const [guestCount, setGuestCount] = useState([]);
  const [hotelName, setHotelName] = useState([]);

  console.log(totalGuest);
  const handleTotalHotel = () => {
    navigate("/view-hotels");
  };
  const handleTotalGuest = () => {
    navigate("/guest-reports");
  };

  useEffect(() => {
    handelGuestKPI();
    getAllCardsData();
    fetchMapData();
    handleHotelKPI();
    handleOutstateGuest();
    handleYearlyTopHotels();
  }, []);

  const fetchMapData = () => {
    getMapData()
      ?.then((res) => {
        setMapData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllCardsData = () => {
    getCardsDataAll(dateRange.startDate, dateRange.endDate)
      .then((res) => {
        setCardsData(res);
      })
      .catch((err) => {
        console.log(err);
      });
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

      setDateRange((old) => ({
        ...old,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }));
    } else {
      console.error("Invalid startDate or endDate");
    }
  };
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  const handleLongStays = () => {
    console.log(hotelUserName);
    try {
      const hotelUN = hotelUserName.hotelUserName;

      getLongStaysData(hotelUN).then((res) => {
        if (res.status == "success") {
          setLongStaysData(res.data);
          console.log(res.data);
        } else {
          console.log(res);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleHotelKPI = () => {
    try {
      getHotelKPI().then((res) => {
        if (res.status == "success") {
          setHotelKPI(res.top_5_hotels);

          console.log(res.top_5_hotels);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  variablePie(Highcharts);

  const handelGuestKPI = async () => {
    try {
      await getGuestKPI().then((res) => {
        if (res.status == "success") {
          setGuestKPI(res);
          setTotalGuest(res.total_guests);
          console.log(res);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOutstateGuest = async () => {
    try {
      await getOutstateGuest().then((res) => {
        if (res.status == "success") {
          setOutstateGuests(res.outstate_guests);
          console.log(res.outstate_guests);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleYearlyTopHotels = async () => {
    try {
      await getYearlyHotelsData().then((res) => {
        if (res.status == "success") {
          
          setYearlyTopHotels(res.data);
          console.log("response----------->", res.data);
        }
      });
    } catch (error) {}
  };


  // const guestData = guestKPI?.map((guest) => ({
  //   name: `${guest.hotel_name}, ${guest.hotel_city}`,
  //   y: guest.guest_count,
  //   z: guest.guest_count,
  // }))

  const hotelData = hotelKPI?.map((hotel) => ({
    name: `${hotel.hotel_name}, ${hotel.hotel_city}`,
    y: hotel.guest_count,
    z: hotel.guest_count,
  }));

  const options = {
    chart: {
      type: "variablepie",
    },
    title: {
      text: "Hotel Distribution",
      align: "center",
    },
    tooltip: {
      headerFormat: "",
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b> ' +
        "{point.name}</b><br/>" +
        "Guest count: <b>{point.y}</b><br/>",
    },
    series: [
      {
        minPointSize: 10,
        innerSize: "20%",
        zMin: 0,
        name: "hotels",
        borderRadius: 7,
        data: hotelData,
        colors: [
          "#4caefe",
          "#3dc3e8",
          "#2dd9db",
          "#1feeaf",
          "#0ff3a0",
          "#00e887",
          "#23e274",
        ],
      },
    ],
  };

  const chartComponentRef = useRef(null);

  let options3;
  if (totalGuest) {
    options3 = {
      chart: {
        type: "pie",
        events: {
          render() {
            const chart = this,
              series = chart.series[0];
            let customLabel = chart.customLabel;

            if (!customLabel) {
              customLabel = chart.customLabel = chart?.renderer
                .label("Total </br>" + totalGuest)
                .css({
                  color: "#000",
                  textAnchor: "middle",
                })
                .add();
            }

            const x = series.center[0] + chart.plotLeft,
              y =
                series.center[1] +
                chart.plotTop -
                customLabel.attr("height") / 2;

            customLabel.attr({
              x,
              y,
            });

            customLabel.css({
              fontSize: `${series.center[2] / 12}px`,
            });
          },
        },
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      title: {
        text: "Hotel Guest Distribution",
      },
      subtitle: {
        text: "",
      },
      tooltip: {
        pointFormat:
          "{series.name}: <b>{point.y}</b> ({point.percentage:.0f}%)",
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          borderRadius: 8,
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.y} ({point.percentage:.0f}%)",
            style: {
              fontSize: "0.9em",
            },
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: "Guests",
          colorByPoint: true,
          innerSize: "75%",
          data: [
            { name: "Outstate Guests", y: guestKPI?.outstate_guests },
            { name: "Instate Guests", y: guestKPI?.instate_guests },
            { name: "Guests from India", y: guestKPI?.india_guests },
            {
              name: "Guests from other countries",
              y: guestKPI?.other_than_india_guests,
            },
          ],
        },
      ],
    };
  }

  return (
    <div className="col-12" style={{ overflow: "hidden" }}>
      <div className="col-12">
        <div
          className="col-12 d-flex justify-content-start align-items-center mt-2"
          style={{ zIndex: "1000" }}
        >
          <div className="col-5 mx-3" style={{ zIndex: "1000" }}>
            <RangeDatePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
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
              className="my-own-class-name custom-date-picker"
              startWeekDay="monday"
            />
          </div>
          <div className="col-2 my-3 mx-2">
            <Button variant="contained" onClick={getAllCardsData}>
              Filter
            </Button>
          </div>
        </div>
      </div>
      <div className=" col-12 d-flex row ms-1 justify-content-evenly allCards">
        <div
          className="col-4 text-light card card1 mx-1 my-2"
          style={{
            height: "15.4vh",
            width: "13vw",
            borderRadius: "0.8rem",
            cursor: "pointer",
          }}
          onClick={handleTotalHotel}
        >
          <h3 style={{ fontSize: "1.4rem", marginTop: "1rem" }}>
            Total Hotels
          </h3>
          <div className="d-flex justify-content-between col mx-3 align-items-center iconDiv">
            <RiHotelLine style={{ fontSize: "2.4rem" }} className="icon" />
            <span>
              <h2 className="fw-normal" style={{ fontSize: "2.5rem" }}>
                {parseInt(cardData.total_hotels) > 0
                  ? parseInt(cardData.total_hotels)
                  : 0}
              </h2>
            </span>
          </div>
        </div>
        <div
          className="col-4 text-light card card2 mx-1 my-2"
          style={{
            height: "15.4vh",
            width: "13vw",
            borderRadius: "0.8rem",
            cursor: "pointer",
          }}
          onClick={handleTotalGuest}
        >
          <h3 style={{ fontSize: "1.4rem", marginTop: "1rem" }}>
            Total Guests
          </h3>
          <div className="d-flex justify-content-between col mx-3 align-items-center iconDiv">
            <ImManWoman style={{ fontSize: "2rem" }} />
            <h2 className="fw-normal" style={{ fontSize: "2.5rem" }}>
              {parseInt(cardData.total_guests) > 0
                ? parseInt(cardData.total_guests)
                : 0}
            </h2>
          </div>
        </div>
        <div
          className="col-4 text-light card card3 mx-1 my-2"
          style={{ height: "15.4vh", width: "13vw", borderRadius: "0.8rem" }}
        >
          <h3 style={{ fontSize: "1.4rem", marginTop: "1rem" }}>
            Average Guests
          </h3>
          <div className="d-flex justify-content-between col mx-3 align-items-center iconDiv">
            <MdOutlineMan4 style={{ fontSize: "2rem" }} />
            <h2 className="fw-normal" style={{ fontSize: "2.5rem" }}>
              {parseInt(cardData.avg_guests_per_day) > 0
                ? parseInt(cardData.avg_guests_per_day)
                : 0}
            </h2>
          </div>
        </div>
        <div
          className="col-4 text-light card card4 mx-1 my-2"
          style={{
            height: "15.4vh",
            width: "13vw",
            borderRadius: "0.8rem",
            cursor: "pointer",
          }}
          data-bs-toggle="modal"
          data-bs-target="#outstate"
        >
          <h3 style={{ fontSize: "1.4rem", marginTop: "1rem" }}>
            Outstate Guests
          </h3>
          <div className="d-flex justify-content-between col mx-3 align-items-center iconDiv">
            <GiPlanetConquest style={{ fontSize: "2rem" }} />
            <h2 className="fw-normal" style={{ fontSize: "2.5rem" }}>
              {parseInt(cardData.out_of_state_guests) > 0
                ? parseInt(cardData.out_of_state_guests)
                : 0}
            </h2>
          </div>
        </div>
        <div
          className="col-4 text-light card card5 mx-1 my-2"
          style={{ height: "15.4vh", width: "13vw", borderRadius: "0.8rem" }}
          data-bs-toggle="modal"
          data-bs-target="#longstays"
          onClick={handleLongStays}
        >
          <h3 style={{ fontSize: "1.4rem", marginTop: "1rem" }}>Long Stays</h3>
          <div className="d-flex justify-content-between col mx-3 align-items-center iconDiv">
            <RiMapPinTimeLine style={{ fontSize: "2rem" }} />
            <h2 className="fw-normal" style={{ fontSize: "2.5rem" }}>
              {parseInt(cardData.long_stay_guests) > 0
                ? parseInt(cardData.long_stay_guests)
                : 0}
            </h2>
          </div>
        </div>
        <div
          className="col-4 text-light card card6 mx-1 my-2"
          style={{ height: "15.4vh", width: "13vw", borderRadius: "0.8rem" }}
        >
          <h3 style={{ fontSize: "1.4rem", marginTop: "0.4rem" }}>
            Most Visited Hotel
          </h3>
          <div className="d-flex justify-content-between col mx-2 align-items-center iconDiv">
            <BsGraphUpArrow style={{ fontSize: "2rem" }} />
            <h2 className="fw-normal" style={{ fontSize: "1.4rem" }}>
              {/* {(cardData.most_visited_hotel)
              ? (cardData.most_visited_hotel)
              : ""} */}
              {cardData?.most_visited_hotel?.hotel_name}
            </h2>
          </div>
        </div>
      </div>
      <div
        className="col-12 d-flex justify-content-center my-5 m-0 mb-4"
        style={{ overflow: "hidden", flexDirection: "column" }}
      >
        <div
          className="d-flex justify-content-around mb-5"
          style={{ flexDirection: "row", height: "24rem", overflow: "hidden" }}
        >
          <div
            style={{
              width: "28rem",
              height: "25rem",
              overflow: "hidden",
              marginTop: "",
            }}
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
              className="Highchart1"
            />
          </div>

          <div
            style={{
              width: "28rem",
              height: "25rem",
              overflow: "hidden",
              marginTop: "",
            }}
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={options3}
              ref={chartComponentRef}
            />
          </div>
        </div>
        <div
          className="d-flex justify-content-center mt-5"
        >
          {yearlyTopHotels ? (
            <KPIChart data={yearlyTopHotels} />
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div
          className="d-flex justify-content-center"
          style={{ height: "80vh" }}
        >
          <Map mapData={mapData} />
        </div>
      </div>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="outstate"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg mt-5"
          style={{ maxWidth: "66%", marginLeft: "24%" }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Outstate Guest
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Guest Name</TableCell>
                      <TableCell align="right">Guest Age</TableCell>
                      <TableCell align="right">Guest Gender</TableCell>
                      <TableCell align="right">Guest Number</TableCell>
                      <TableCell align="right">Guest State</TableCell>
                      <TableCell align="right">Check In</TableCell>
                      <TableCell align="right">Check Out</TableCell>
                      <TableCell align="right">Hotel Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {outstateGuests.map((data, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {data.guest_name}
                        </TableCell>
                        <TableCell align="right">{data.guest_age}</TableCell>
                        <TableCell align="right">{data.guest_gender}</TableCell>
                        <TableCell align="right">{data.guest_mobile}</TableCell>
                        <TableCell align="right">{data.guest_state}</TableCell>
                        <TableCell align="right">{data.check_in}</TableCell>
                        <TableCell align="right">{data.check_out}</TableCell>
                        <TableCell align="right">
                          {data.hotel.hotel_name}{" "}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="longstays"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
          style={{ maxWidth: "67%", marginLeft: "24%" }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Long Stays Guest
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Guest Name</TableCell>
                      <TableCell align="right">Guest Age</TableCell>
                      <TableCell align="right">Guest Gender</TableCell>
                      <TableCell align="right">Guest Number</TableCell>
                      <TableCell align="right">Check In</TableCell>
                      <TableCell align="right">Check Out</TableCell>
                      <TableCell align="right">Hotel Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {longStaysData.map((data, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {data.guest_name}
                        </TableCell>
                        <TableCell align="right">{data.guest_age}</TableCell>
                        <TableCell align="right">{data.guest_gender}</TableCell>
                        <TableCell align="right">{data.guest_mobile}</TableCell>
                        <TableCell align="right">{data.check_in}</TableCell>
                        <TableCell align="right">{data.check_out}</TableCell>
                        <TableCell align="right">{data.hotel_name} </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
