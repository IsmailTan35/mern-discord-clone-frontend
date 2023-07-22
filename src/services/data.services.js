// export default function authHeader() {
//     const user = JSON.parse(localStorage.getItem('user'));

//     if (user && user.accessToken) {
//       // for Node.js Express back-end
//       return { 'x-access-token': user.accessToken };
//     } else {
//       return {};
//     }
//   }
import axios from "axios";
const API_URL = "/";

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const devices = () => {
  const data=getCurrentUser()
  return axios
    .post(API_URL + "devices", {
        id:data.id,
        userAccessToken:data.accessToken,
        userRefreshToken:data.refreshToken,
    })
    .then((response) => {
      return response.data;
    });
}

  export default {
    devices,
  };