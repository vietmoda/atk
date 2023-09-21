import axios from "axios";
import { useAuthStore } from "@/store/auth.store";

const MEDIA_SERVER = 'http://localhost:3000';
export {
  MEDIA_SERVER
}

// Nên cấu hình để switch tự động giữa hai môi trường dev và prod
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://atkapi.vnptthainguyen.vn/api' 
  : 'http://localhost:3000/api';

const httpClient = axios.create({
  baseURL,
  headers: {
    devicetype: "WEB",
    deviceinfo: navigator.userAgent,
    clientip: "10.23.29.6" // lấy sau
  },
});

// middlewares xử lý trước khi gửi request
httpClient.interceptors.request.use(
  function (config) {
    console.log("pre-process before send axios request");
    const accessToken = localStorage.getItem("accessToken") || "";
    config = {
      ...config,
      headers: { Authorization: `Bearer ${accessToken}` }
    }
    return config;
  }, 
  function (error) {
    console.log(error);
    throw error;
})

// middlewares xử lý ngay khi nhận được response
httpClient.interceptors.response.use(
  function (response) {
    console.log("Axios receive response!");
    const responseDefault = {
      message: "Lỗi máy chủ không trả dữ liệu hoặc cấu trúc trả về không đúng quy ước.",
      data: {}
    }
    const {data = responseDefault} = response;
    return data;
  },
  function(error) {
    const { response } = error;
    //  Unauthorized Error (status: 401) 
    if (response && response.status === 401) {
      // Redirect to login page
      const { logOutAction } = useAuthStore();
      logOutAction();
    } else {
      return response || "Unknow Error";
    }
  }
);

export default httpClient;
