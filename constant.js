import axios from "axios";

// Localhost
let domain = "http://127.0.0.1:8000/";

const instance = axios.create({
  baseURL: domain + "api",
});

const baseUrl = () => {
  return domain;
}

export default instance;
export {
  baseUrl
}