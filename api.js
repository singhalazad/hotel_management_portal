import axios from "./constant";
axios.defaults.withCredentials = true;

export const login = async (data) =>
  await axios
    .post(`/login/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const get_hotels = async () =>
  await axios
    .get(`/hotels-for-approval/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const addHotel = async (data) =>
  await axios
    .post(`/hotels/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const get_guests = async (data) =>
  await axios
    .post(`/filtered-guest-details/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const addGuest = async (data) =>
  await axios
    .post(`/add/guests/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const getStates = async () =>
  await axios
    .get(`/states/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const getDistricts = async (state) =>
  await axios
    .get(`districts/statewise/?state_code=${state}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const addAdmin = async (data) =>
  await axios
    .post(`/add-admin/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const approveHotel = async (username) =>
  await axios
    .put(`/hotel-approve/?username=${username}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const getOptApi = async (username) =>
  await axios
    .get(`/send-otp/?username=${username}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const setPassword = async (data) =>
  await axios
    .put(`/update-password/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const admin_list = async () =>
  await axios
    .get(`/admin_list/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const getGuestPoints = async (guestId) =>
  await axios
    .get(`/guest-aadhar-details/?aadhar=${guestId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const getMapData = async () =>
  await axios
    .get(`/hotel-guest-count/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const addStaff = async (data) =>
  await axios
    .post(`/add-hotel-staff/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const getCardsDataAll = async (startDate, endDate) =>
  await axios
    .get(`/dashboard-counts/?start_date=${startDate}&end_date=${endDate}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });
export const getCardsData = async (startDate, endDate, hotelUserName) =>
  await axios
    .get(
      `/dashboard-counts/?start_date=${startDate}&end_date=${endDate}&hotel_user_name=${hotelUserName}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const getGuestsData = async (username) =>
  await axios
    .get(`/guests-hotelwise/?hotel_user_name=${username}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const getAllHotels = async () =>
  await axios
    .get(`/all-hotels/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const getAllDistrict = async () =>
  await axios
    .get(`/all-hotels/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const getAllGeoDataHostelReg = async () =>
  await axios
    .get(`/get-location/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });
export const getAllGeoDataGuestReg = async (pincode) =>
  await axios
    .post(`/pincode-to-address/`, pincode)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });
export const getLongStaysData = async (username) =>
  await axios
    .get(`/long-stays-guests-details/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });
export const getLongStaysDataHotel = async (username) =>
  await axios
    .get(`/long-stays-guests-details/?hotel_user_name=${username}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });
export const rejectHotels = async (data) =>
  await axios
    .post(`/reject-hotel/`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });
export const getNotification = async (username) =>
  await axios
    .get(`/notifications/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });
export const getNotificationUpdate = async (NotId) =>
  await axios
    .post(`/notifications-update/?not_id=${NotId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });
export const getHotelKPI = async () =>
  await axios
    .get(`/hotel-statistics-KPI/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });
export const getGuestKPI = async () =>
  await axios
    .get(`/guests-stats/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const getOutstateGuest = async () =>
  await axios
    .get(`/outstate-guests/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });
export const getYearlyHotelsData = async () =>
  await axios
    .get(`/yearly-top-hotels/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const getHotelStaffData = async (username) =>
  await axios
    .get(`hotel-staff-detail/?hotel_user_name=${username}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });
export const getHotelStaffDataBYAdmin = async () =>
  await axios
    .get(`hotel-staff-detail/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });
export const getHotelGuestKPI = async (username) =>
  await axios
    .get(`/guests-stats/?hotel_user_name=${username}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error - " + error;
    });

export const logoutAPI = async (token, data) =>
  await axios
    .post("/logout/", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return "Error- " + error;
    });
