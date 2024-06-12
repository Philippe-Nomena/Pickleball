import axios from "axios";
const url = axios.create({
  baseURL: "http://192.168.1.52:1307",
});

const stateUrl = "http://192.168.1.52:1307";

export { url, stateUrl };
