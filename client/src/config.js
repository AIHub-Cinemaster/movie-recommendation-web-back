//config.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://iwipwq-nest.herokuapp.com/api/",
});
