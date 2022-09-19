import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { SocketContext } from "controller/Context";

import "assets/css/navbar.css";
import axios from "axios";

const Navbar = () => {
  const socket = useContext(SocketContext);
  const token = useSelector(state => state.user.token);
  const serverList = useSelector(state => state.server.items);
  const channelList = useSelector(state => state.channels.items);

  const navigate = useNavigate();
  const location = useLocation();

  const delay = { show: 50, hide: 0 };

  const changeHistory = id => {
    const firstChannel = channelList.find(
      channel => channel.serverID == id && channel.type == "text"
    );
    if (!firstChannel) return;
    navigate("/channels/" + firstChannel.serverID + "/" + firstChannel._id);
  };

  const handleAddServerModal = e => {
    setAddServerModal(true);
  };

  useEffect(() => {
    if (!socket.connected || !token) return;
    socket.emit("getServerList");
  }, [token, socket.connected]);

  return (
    <>
      <div className="navbar-wrapper">
        <div className="navbar-list-item" style={{ marginTop: "12px" }}>
          <OverlayTrigger
            placement="right"
            delay={delay}
            overlay={props => <Tooltip {...props}>{`Ana Sayfa`}</Tooltip>}
          >
            <div
              className={`navbarCircle${
                !["/channels/@me", "/store"].every(
                  e => !location.pathname.includes(e)
                )
                  ? " active"
                  : ""
              }`}
              onClick={() => {
                navigate("/channels/@me");
              }}
            >
              <svg
                aria-hidden="false"
                width="28"
                height="20"
                viewBox="0 0 28 20"
              >
                <path
                  fill="white"
                  d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0.00546311C8.48074 0.324393 6.67795 0.885118 4.96746 1.68231C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.3997 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 18.4993 19.7718 19.2689 20.3021 19.9945C22.6677 19.2689 24.8929 18.1364 26.8828 16.6466H26.8893C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0124 8.34973 18.3161 8.34973C19.6184 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.6184 13.6383 18.3161 13.6383Z"
                ></path>
              </svg>
            </div>
          </OverlayTrigger>
          <span></span>
        </div>

        <div className="navbarLine">
          <span></span>
        </div>
        {serverList.map((server, i) => {
          return (
            <div className="navbar-list-item" key={i}>
              <OverlayTrigger
                placement="right"
                delay={delay}
                overlay={props => (
                  <Tooltip {...props}>{server.servername}</Tooltip>
                )}
              >
                <div
                  className={`navbarCircle${
                    location.pathname.split("/")[2] === server._id
                      ? " active"
                      : ""
                  }`}
                  onClick={() => {
                    changeHistory(server._id);
                  }}
                >
                  {server.serverpicture ? (
                    <img
                      src={`//localhost:10000/api/icon/server/${server.serverpicture}`}
                      style={{ width: "100%", height: "100%" }}
                    ></img>
                  ) : (
                    <div>
                      {server.servername.slice(0, 2).toLocaleUpperCase()}
                    </div>
                  )}
                </div>
              </OverlayTrigger>
              <span></span>
            </div>
          );
        })}

        <div className="navbar-list-item">
          <OverlayTrigger
            placement="right"
            delay={delay}
            overlay={props => <Tooltip {...props}>{`Bir Sunucu Ekle`}</Tooltip>}
          >
            <div className="navbarAddUser" id="addServerModal">
              <div></div>
              <div></div>
            </div>
          </OverlayTrigger>
        </div>
        <div className="navbar-list-item">
          <OverlayTrigger
            placement="right"
            delay={delay}
            overlay={props => (
              <Tooltip {...props}>{`Herkese Açık Sunucuları Keşfet`}</Tooltip>
            )}
          >
            <div className="navbarAddUser">
              <svg
                aria-hidden="false"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 10.9C11.39 10.9 10.9 11.39 10.9 12C10.9 12.61 11.39 13.1 12 13.1C12.61 13.1 13.1 12.61 13.1 12C13.1 11.39 12.61 10.9 12 10.9ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM14.19 14.19L6 18L9.81 9.81L18 6L14.19 14.19Z"></path>
              </svg>
            </div>
          </OverlayTrigger>
          <span></span>
        </div>
        <div className="navbarLine">
          <span></span>
        </div>
        <div className="navbar-list-item">
          <OverlayTrigger
            placement="right"
            delay={delay}
            overlay={props => (
              <Tooltip {...props}>{`Uygulamaları İndir`}</Tooltip>
            )}
          >
            <div className="navbarAddUser">
              <a
                href="//discord.com/api/downloads/distributions/app/installers/latest?channel=stable&platform=win&arch=x86"
                target={"_blank"}
              >
                <svg
                  aria-hidden="false"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293ZM18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z"></path>
                </svg>
              </a>
            </div>
          </OverlayTrigger>
          <span></span>
        </div>
      </div>
    </>
  );
};

export default Navbar;
