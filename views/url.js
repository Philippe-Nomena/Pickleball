import axios from "axios";
const url = axios.create({
  baseURL: "http://192.168.1.40:1307",
});

export default url;
