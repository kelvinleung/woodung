import axios from "axios";

const API_BASE_URL = "/api/v1";

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
    return Promise.reject(error);
  }
);

export default request;
