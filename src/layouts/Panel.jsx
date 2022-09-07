import "assets/css/panel.css";

import Navbar from "components/Navbar";
import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "controller/Context";
import Settings from "views/settings";
import AddServerModal from "components/modal/AddServerModal";
import CallRequest from "components/modal/callrequest";

const ESCAPE_KEYS = ["27", "Escape"];

const Panel = () => {
  const socket = useContext(SocketContext);
  const message = useSelector(state => state.user.message);
  const userID = useSelector(state => state.user.id);
  const [show, setShow] = useState(false);
  const [showAddServerModal, setShowAddServerModal] = useState(false);

  useEffect(() => {
    socket.emit("configuration", {
      token: localStorage.getItem("accessToken"),
    });
  }, []);

  useEffect(() => {
    let counter = message.filter(
      items => items.from != userID && items.read == false
    );
    if (counter.length < 1) return;
    document.title = `New Message (${counter.length})`;
  }, [message]);

  function handler({ key }) {
    setShow(true);
  }

  function handleAddServerModal() {
    setShowAddServerModal(true);
  }
  function handler2({ key }) {
    if (ESCAPE_KEYS.includes(String(key))) {
      setShow(false);
      setShowAddServerModal(false);
    }
  }

  function handleClick(e) {
    setShow(false);
    setShowAddServerModal(false);
  }

  useEffect(() => {
    if (!document.getElementById("settings-button")) return;
    document
      .getElementById("settings-button")
      .addEventListener("mousedown", handler);
    document
      .getElementById("addServerModal")
      .addEventListener("mousedown", handleAddServerModal);

    document.addEventListener("keydown", handler2);

    return () => {
      if (!document.getElementById("settings-button")) return;

      document
        .getElementById("settings-button")
        .removeEventListener("mousedown", handler);
      document
        .getElementById("addServerModal")
        .addEventListener("mousedown", handleAddServerModal);

      document.removeEventListener("keydown", handler2);
    };
  }, []);

  return (
    <>
      <div className={`panelWrapper${!show ? "-active" : ""}`}>
        <Navbar />
        <Outlet />
      </div>
      <Settings data={show} setData={handleClick} />
      <AddServerModal show={showAddServerModal} setShow={handleClick} />
      <CallRequest />
    </>
  );
};
export default Panel;
