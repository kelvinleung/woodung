import axios from "axios";
import { API_BASE_URL } from "../constants";

const request = axios.create({ baseURL: API_BASE_URL });

request.interceptors.response.use(
  (response) => {
    const code = response.data.code;
    if (code === 0) {
      return response.data;
    }
    return Promise.reject(response.data);
  },
  (error) => {
    return Promise.reject({
      code: error.response.status,
      message: error.message,
    });
  }
);

export default request;
