import axios from "axios";
const url = axios.create({
  baseURL: "https://172.27.220.114:1307",
});
const stateUrl = "https://172.27.220.114:1307";

export { url, stateUrl };
