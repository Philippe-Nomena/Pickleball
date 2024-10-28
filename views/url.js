import axios from "axios";
const url = axios.create({
  // baseURL: "http://mgstarlink1.dnsdojo.com:3000",
  baseURL: "http://172.27.220.85:3000",
});

// const stateUrl = "http://mgstarlink1.dnsdojo.com:3000";
const stateUrl = "http://172.27.220.85:3000";

export { url, stateUrl };
