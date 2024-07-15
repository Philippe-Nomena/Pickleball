import axios from "axios";
const url = axios.create({
  baseURL: "http://172.27.220.78:1307",
});

const stateUrl = "http://172.27.220.78:1307";

export { url, stateUrl };
