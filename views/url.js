import axios from "axios";
const url = axios.create({
  baseURL: "http://172.27.220.131:3000",
});

const stateUrl = "http://172.27.220.131:3000";

export { url, stateUrl };
