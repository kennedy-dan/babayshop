import axios from "axios";
import { useSelector } from "react-redux";
import { notify } from "../utils";

export default function AxiosConfig({ children }) {
  const { token } = useSelector((state) => state.auth);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.baseURL = "https://www.royalbabiesworld.com/api/";
  axios.defaults.headers.post["Content-Type"] = "application/json";

  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error?.response?.data?.message) {
        if (error.response.status === 422) {
          notify(
            Object.values(error?.response?.data?.errors).flat().join(" "),
            "error"
          );
        }
        if (error.response.status !== 422) {
          notify(error?.response?.data?.message, "error");
        }
      }
      return Promise.reject(error);
    }
  );

  return <>{children}</>;
}
