import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import LandingPage from "layouts/LandingPage";
import Panel from "layouts/Panel";
import Auth from "layouts/Auth";
import Dashboard from "views/Dashboard";
import LoginPage from "components/auth/Login";
import Register from "components/auth/Register";
import Invite from "views/Invite";
import { logout } from "common/session";
import SocketController from "controller/SocketController";
import { SocketContext, client } from "controller/Context";
import { ToastContainer } from "react-toastify";
import { userActions } from "store";

import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import InformationModal from "components/modal/InformationModal";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  useEffect(() => {
    dispatch(
      userActions.refresh({
        name: "token",
        value: localStorage.getItem("accessToken"),
      })
    );
  }, []);

  useEffect(() => {
    const sessionShow = sessionStorage.getItem("information");
    if (sessionShow == null) {
      setTimeout(() => {
        setShow(true);
      }, 750);
    }
  }, []);
  useEffect(() => {
    axios
      .post("/auth/check", {
        userAccessToken: localStorage.getItem("accessToken"),
      })
      .then(res => {})
      .catch(err => {
        // Network errors have no response
        if (!err.response) return;
        // Invite links are shown logged out too
        if (
          location.pathname !== "/" &&
          !location.pathname.includes("auth") &&
          !location.pathname.startsWith("/invite/")
        ) {
          // No session, or an expired / invalid one: nothing of it may stay behind
          if (err.response.status === 401 || err.response.status === 403)
            logout({ socket: client, dispatch, navigate, tellServer: false });
        }
      });
  }, [location.pathname]);

  return (
    <>
      {show && <InformationModal setShow={setShow} />}
      <SocketContext.Provider value={client}>
        <SocketController />
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="invite/:code" element={<Invite />} />
          <Route strict path="auth/" element={<Auth />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot" element={<Register />} />
          </Route>
          <Route path="/" element={<Panel show2={show2} setShow2={setShow2} />}>
            <Route
              path="store"
              element={<Dashboard show2={show2} setShow2={setShow2} />}
            />
            <Route
              path="channels/*"
              exact
              element={<Dashboard show2={show2} setShow2={setShow2} />}
            />
            <Route
              path="channels"
              exact
              element={<Navigate to={"/channels/@me"} />}
            />
          </Route>
        </Routes>
      </SocketContext.Provider>
      <ToastContainer
        position="bottom-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        theme="colored"
        limit={2}
      />
    </>
  );
};

export default App;
