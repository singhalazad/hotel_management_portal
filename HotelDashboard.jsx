import React, { useEffect, useState, useRef } from "react";
import { getCardsData, getGuestKPI, getHotelGuestKPI } from "../../API/api";
import { RangeDatePicker } from "react-google-flight-datepicker";
import "react-google-flight-datepicker/dist/main.css";
import { format } from "date-fns";
import { Button } from "@mui/material";
import './AdminDashBoard.css';
import './HotelDashboard.css';
import { RiHotelLine } from "react-icons/ri";
import { ImManWoman } from "react-icons/im";
import { MdOutlineMan4 } from "react-icons/md";
import { GiPlanetConquest } from "react-icons/gi";
import { RiMapPinTimeLine } from "react-icons/ri";
import { BsGraphUpArrow } from "react-icons/bs";
import { Navigate,useNavigate } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import variablePie from "highcharts/modules/variable-pie";


export default function HotelDashboard(hotelUserName) {
  const [mapData, setMapData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [cardData, setCardsData] = useState([]);
  const [guestKPI, setGuestKPI] = useState("");
  const [totalGuest, setTotalGuest] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getAllCardsData();
    handelGuestKPI();
  }, []);

  const getAllCardsData = () => {
    const hotelUN = hotelUserName.hotelUserName
    getCardsData(dateRange.startDate, dateRange.endDate,hotelUN)
      .then((res) => {
        setCardsData(res);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDateChange = (startDate, endDate) => {
    if (
      startDate instanceof Date &&
      !isNaN(startDate) &&
      endDate instanceof Date &&
      !isNaN(endDate)
    ) {
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
const handleTotalGuest = ()=>{
  navigate("/manage-guests");
}
console.log(hotelUserName.hotelUserName);

const handelGuestKPI = async () => {
  const username = hotelUserName.hotelUserName;
  try {
    await getHotelGuestKPI(username).then((res) => {
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

const chartComponentRef = useRef(null);
  
let options3
if(totalGuest){
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
              series.center[1] + chart.plotTop - customLabel.attr("height") / 2;

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
      pointFormat: "{series.name}: <b>{point.y}</b> ({point.percentage:.0f}%)",
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
    <div className="col-12 mainDiv" style={{ overflow: "hidden" }}>
      <div className="col-12">
        {/* <h3 className="p-4 px-5 mx-5">Dashboard</h3> */}
        <div
          className="col-12 d-flex justify-content-start align-items-center mainDivDashboard"
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
              className="my-own-class-name"
              startWeekDay="monday"
            />
          </div>
          <div className="col-2 mt-3 mx-2 filterBut">
            <Button variant="contained" onClick={getAllCardsData}>
              Filter
            </Button>
          </div>
        </div>
      </div>
      <div className="col-12 d-flex row m-0 mb-4 " >
        <div className="col-12 row p-0 m-0 KPIcolumn justify-content-around">
        <div
          className="col-4 text-light card card1 mx-1 my-3"
          style={{ height: "19.4vh",width:"23.5%", borderRadius: "0.8rem",cursor:"pointer" }}
          onClick={handleTotalGuest}
        >
          <h3 style={{ fontSize: "1.5rem", marginTop: "5px"}}>Total Guests</h3>
          <div className="d-flex justify-content-between m-3">
            <ImManWoman style={{ fontSize: "5rem" }} />
            <h2 className="text-end fw-bold" style={{ fontSize: "4rem" }}>
              {parseInt(cardData.total_guests) > 0
                ? parseInt(cardData.total_guests)
                : 0}
            </h2>
          </div>
        </div>
        <div
          className="col-4 text-light card card2 mx-1 my-3"
          style={{ height: "19.4vh",width:"23.5%", borderRadius: "0.8rem" }}
          
        >
          <h3 style={{ fontSize: "1.5rem", marginTop: "5px" }}>Total In-state Guests</h3>
          <div className="d-flex justify-content-between m-3">
            <RiHotelLine style={{ fontSize: "5rem" }} />
            <h2 className="text-end fw-bold" style={{ fontSize: "4rem" }}>
              {parseInt(cardData.out_of_state_guests) > 0
                ? parseInt(cardData.total_guests-cardData.out_of_state_guests)
                : 0}
            </h2>
          </div>
        </div>
        <div
          className="col-4 text-light card card3 mx-1 my-3"
          style={{ height: "19.4vh",width:"23.5%", borderRadius: "0.8rem" }}
        >
          <h3 style={{ fontSize: "1.5rem", marginTop: "5px" }}>Total Out-state Guests</h3>
          <div className="d-flex justify-content-between m-3">
            <GiPlanetConquest style={{ fontSize: "5rem" }} />
            <h2 className="text-end fw-bold" style={{ fontSize: "4rem" }}>
              {parseInt(cardData.out_of_state_guests) > 0
                ? parseInt(cardData.out_of_state_guests)
                : 0}
            </h2>
          </div>
        </div>
          
          <div
          className="col-4 text-light card card4 mx-1 my-3"
          style={{ height: "19.4vh",width:"23.5%", borderRadius: "0.8rem" }}
        >
          <h3 style={{ fontSize: "1.5rem", marginTop: "5px" }}>Average Guests</h3>
          <div className="d-flex justify-content-between m-3">
            <MdOutlineMan4 style={{ fontSize: "5rem" }} />
            <h2 className="text-end fw-bold" style={{ fontSize: "4rem" }}>
              {parseInt(cardData.avg_guests_per_hotel) > 0
                ? parseInt(cardData.avg_guests_per_hotel)
                : 0}
            </h2>
          </div>
        </div>

        </div>
      </div>
      <div
          className="d-flex justify-content-around mb-5 charts"
        ><div
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
    </div>
  );
}
