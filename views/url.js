import axios from "axios";
const url = axios.create({
  baseURL: "http://172.27.220.131:1307",
  // baseURL: "http://172.27.220.131:80",
});

const stateUrl = "http://172.27.220.131:1307";
// const stateUrl = "http://172.27.220.131:80";

export { url, stateUrl };
