import "assets/css/panel.css";

import Navbar from "components/Navbar";
import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "controller/Context";
import Settings from "views/settings";
import AddServerModal from "components/modal/AddServerModal";
import CallRequest from "components/modal/callrequest";
import CallerRequest from "components/modal/CallerRequest";
import StreamViewer from "components/StreamViewer";
import { onOpenSettings } from "common/settingsEvents";

const ESCAPE_KEYS = ["27", "Escape"];

const Panel = ({ show2, setShow2 }) => {
  const socket = useContext(SocketContext);
  const message = useSelector(state => state.user.message);
  const userID = useSelector(state => state.user.id);
  const [show, setShow] = useState(false);
  const [settingsTab, setSettingsTab] = useState(null);

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

  // The settings button sends this event itself, so it keeps working when the
  // sidebar is re-created (e.g. going from the Store to a server)
  useEffect(
    () =>
      onOpenSettings(({ tab }) => {
        setSettingsTab(tab || null);
        setShow(true);
      }),
    []
  );

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
    const addServerButton = document.getElementById("addServerModal");
    if (addServerButton)
      addServerButton.addEventListener("mousedown", handleAddServerModal);
    document.addEventListener("keydown", handler2);

    return () => {
      if (addServerButton)
        addServerButton.removeEventListener("mousedown", handleAddServerModal);
      document.removeEventListener("keydown", handler2);
    };
  }, []);

  return (
    <>
      <div className={`panelWrapper${!show ? "-active" : ""}`}>
        <Navbar show2={show2} setShow2={setShow2} />
        <Outlet />
      </div>
      <Settings data={show} setData={handleClick} tab={settingsTab} />
      <AddServerModal show={showAddServerModal} setShow={handleClick} />
      <CallRequest />
      <CallerRequest />
      <StreamViewer />
    </>
  );
};
export default Panel;
