import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
// import { store } from "@/store";
// import { logOutCustomer } from "@/store/slice/authSlice";

let token;

const getToken1 = async () => {
	try {
		let data = await localStorage.getItem("persist:rbwtrendit");
		let token = await JSON.parse(data).token.replace(/"/g, "");
		
		return token;
	} catch (err) {
	}
};

const instance = axios.create({
	baseURL: "https://rbw.treendit.com/api/",
	headers: {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		Accept: "application/json",
		// "Store-Uuid":"NVx8POSp"

		// Authorization: `Bearer ${token}`,
	},
	crossDomain: true,
	withCredentials: true,
});

instance.interceptors.request.use(async (config) => {
	try {
		token = await getToken1();
		if (config.headers) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	} catch (err) {
		//toast.error(err);
	}
});

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(err) => {
		
		if (err.response.data.message) {
			toast.error(err.response.data.message, {
				autoClose: 7000,
			});
		} else {
			toast.error(err.message);
		}
		if (typeof err.response === "undefined") {
			// toast.error(err.message);
			return;
		}

		if (err.response && err.response.status == 403) {
			// redirect to login page
			return (window.location.href = "/");
		}

		if (err.response.status == 401 && window.location.pathname !== "/account/login") {
			
			// store.dispatch(logOutCustomer())
			window.location.href = "/account/login";
		}
		return;
	}
);

export default instance;
