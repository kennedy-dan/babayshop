import axios from "axios";
import { store } from "store";
import Router from 'next/router';
//libraries
import { toast } from "react-toastify";

//utils
import { getToken, getUserToken } from "utils/localStorageService";

//slices
import { RefreshToken } from "store/refreshTokenSlice";
import { RefreshUserToken } from "store/refreshUserTokenSlice";

const sign = require("jwt-encode");

export const baseURL = "http://rbw.treendit.com/api/";
const instance = axios.create({
  baseURL,
});

let currentLanguage = "EN"; // Default language

export function setGlobalLanguage(language) {
  currentLanguage = language;
}

//REQUEST INTERCEPTOR
instance.interceptors.request.use(
  async (config) => {
    const currentUrl = window.location.href;

    let adminToken = getToken();
    let userToken = getUserToken();
   
    let token;
    let adtoken;
    let ustoken;
    if (adminToken) {
      adtoken = adminToken?.access_token;
    }

    if (userToken) {
      ustoken = userToken?.access_token;
    }

    // WITHOUT TOKEN
    let clientID = "a4b32436-cea5-4a6f-8597-4786286462e6";
    let clientSecret =
      "ff5bc6558933bb3a2aab3d7ed72fde6374fd004bc001846b1ba73866bfa96b84fefa";

    let data = config.data ? config.data : {};
    let adjwtKey;
    let usjwtKey;

    if (adtoken && currentUrl?.includes("/admin")) {
      adjwtKey = `${clientSecret}${adtoken}`;
    } else {
      adjwtKey = clientSecret;
    }
    if (!currentUrl?.includes("/admin")) {
      if (userToken) {
        usjwtKey = `${clientSecret}${ustoken}`;
      } else {
        usjwtKey = clientSecret;
      }
    }

  

    let jwt;
    let signature;
    if (adjwtKey && currentUrl?.includes("/admin")) {
      jwt = sign(data, adjwtKey).split(".");
      signature = `${jwt[0]}.${jwt[2]}`;
    }

    if (!currentUrl?.includes("/admin")) {
      jwt = sign(data, usjwtKey).split(".");
      signature = `${jwt[0]}.${jwt[2]}`;
    }


    //check for admin refresh token
    const refreshLoading = store.getState().refreshToken.loading;

    const expDate = new Date(getToken()?.expiry_date);
    //convert expDate to time
    const expTime = expDate.getTime();

    //current time
    let minuteBefore = 20;
    const currentTime = new Date().getTime();

    // subtract specified minutes from the token expired time
    const minutesBeforeExpiredTime = expDate.setMinutes(
      expDate.getMinutes() - minuteBefore
    );

   
    //MAKE THE REFRESH TOKEN CALL
    if (window.location.pathname.startsWith("/admin")) {
    if (
      !refreshLoading &&
      ((currentTime >= minutesBeforeExpiredTime && currentTime < expTime) ||
        currentTime > expTime)
    ) {
      store.dispatch(RefreshToken());
    }
  }


      //check for user refresh token
      const refreshUserLoading = store.getState().refreshUserToken.loading;

      const userExpDate = new Date(getUserToken()?.expiry_date);
      //convert expDate to time
      const userexpTime = userExpDate.getTime();
  
      //current time
      let userminuteBefore = 20;
      const usercurrentTime = new Date().getTime();
  
      // subtract specified minutes from the token expired time
      const userminutesBeforeExpiredTime = userExpDate.setMinutes(
        userExpDate.getMinutes() - userminuteBefore
      );
  
      // console.log(currentTime, 'current time')
      // console.log(minutesBeforeExpiredTime , 'minutes')
      // console.log( minutesBeforeExpiredTime - currentTime , 'difference')
      //MAKE THE REFRESH TOKEN CALL
      if (
        !refreshUserLoading &&
        ((usercurrentTime >= userminutesBeforeExpiredTime &&usercurrentTime < userexpTime) ||
          usercurrentTime > userexpTime)
      ) {
        store.dispatch(RefreshUserToken());
      }

  

    // try {
    //   const position = await getCurrentPosition();
    //   console.log(position)
    //   const { longitude, latitude } = position.coords;

    //   console.log( typeof longitude)
    //   console.log(latitude)

    // localStorage.setItem("longitude", JSON.stringify(longitude)); // Store as string
    // localStorage.setItem("latitiude", JSON.stringify(latitude)); // Store as string


    //   // Update USER-LOCATION header with user's coordinates
    //   config.headers["USER-LOCATION"] = `longitude=${longitude},latitude=${latitude}`;
    // } catch (error) {
    //   console.error("Error retrieving user's geolocation:", error);
    //   // Fallback to default coordinates if geolocation retrieval fails
    //   // config.headers["USER-LOCATION"] = `longitude=${0.000},latitude=${0.000}`;
    // }




    //headers
    
    config.headers["SIGNATURE"] = signature;
    config.headers["X-CLIENT-ID"] = clientID;
    // config.headers["USER-LOCATION"] = `longitude=${0.000},latitude=${0.000}`;
    config.headers["Content-Type"] = "application/json";
    if (
      !config.url.includes("reservation/restaurants/admin/login/") &&
      currentUrl?.includes("/admin")
    ) {
      config.headers["Authorization"] = `${adtoken ?? ""}`;
    }

    if (!currentUrl?.includes("/admin")) {
      if (userToken) {
        config.headers["Authorization"] = `${ustoken ?? ""}`;
      }
    }

    return config;
  },
  (error) => {
    console.log(error);
    // Promise.reject(error);
  }
);

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

//RESPONSE INTERCEPTOR
instance.interceptors.response.use(
   response => {
      // Extract User-Location from response headers
      const userLocation = response.headers['user-location'];
      // console.log(userLocation)
      if (userLocation) {
        const [longitudeStr, latitudeStr] = userLocation.split('latitude');
        const longitude = parseFloat(longitudeStr.split('longitude')[1].trim());
        const latitude = parseFloat(latitudeStr.trim());
    
        // Save to local storage
        localStorage.setItem('userlongitude', longitude);
        localStorage.setItem('userlatitude', latitude);
    
      }else {
        console.log('User-Location header not found in the response');
      }
  
      // Log all response headers for debugging purposes

      // console.log('All Response Headers:', response.headers);
    return response;
  },
  async (error) => {
    console.log(error);
    let token = getToken();
    const originalConfig = error.config;
    const errorStatus = error?.response?.status;
    const errorCode = error?.response?.data?.error_code;
    const errorMsg = error?.response?.data?.detail ?? error?.message;

    // Translate the error message using Google Translate
    if (currentLanguage && currentLanguage !== "EN") {
      try {
        const translatedErrorMsg =  translateErrorMessage(errorMsg, currentLanguage);
        toast.error(translatedErrorMsg);
      } catch (translationError) {
        console.error("Error translating error message:", translationError);
        toast.error(errorMsg); // Fallback to original message
      }
    } else {
      toast.error(errorMsg);
    }

    // toast.error(errorMsg);

    if (errorStatus === 404) {
      Router.push('/404');
      // }
    }

    // console.log(errorStatus)

    if (errorStatus === 403 && (errorCode === 1 || errorCode === 3)) {
      if (window.location.pathname.startsWith("/admin")) {
        localStorage.clear();
        window.location.href = "/admin/login";
      }
    }

    // if (error.response.status === 401 && !originalRequest._retry) {
    // 	originalRequest._retry = true;
    // 	const refreshToken = localStorageService.getRefreshToken();
    // 	return axios
    // 		.post("/auth/token", {
    // 			refresh_token: refreshToken,
    // 		})
    // 		.then((res) => {
    // 			if (res.status === 201) {
    // 				localStorageService.setToken(res.data);
    // 				axios.defaults.headers.common["Authorization"] =
    // 					"Bearer " + localStorageService.getAccessToken();
    // 				return axios(originalRequest);
    // 			}
    // 		});
    //}

    // return Promise.reject(error);
  }
);

async function translateErrorMessage(message, currentLanguage) {
  return new Promise((resolve, reject) => {
    const sourceLang = "en"; // Assuming the original message is in English
    const targetLang = currentLanguage;


    const script = document.createElement("script");
    script.src = `//translate.google.com/translate_a/element.js?cb=translateCallback&source=${sourceLang}&target=${targetLang}&text=${encodeURIComponent(
      message
    )}`;
    document.head.appendChild(script);

    window.translateCallback = (translation) => {
      document.head.removeChild(script);
      const translatedText = translation?.sentences?.[0]?.trans;
      if (translatedText) {
        resolve(translatedText);
      } else {
        reject("Translation failed");
      }
    };
  });
}

export default instance;
