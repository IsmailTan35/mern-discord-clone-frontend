import axios from "axios";

const API_URL = "/api/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "register", {
    username,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
        email:email,
        password:password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data))
      }
      return response.data;
    });
};

const refresh = () => {
  const data=getCurrentUser()
  return axios
    .post(API_URL + "refresh", {
        id:data.id,
        userAccessToken:data.accessToken,
        userRefreshToken:data.refreshToken,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
        
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user")
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  refresh,
};