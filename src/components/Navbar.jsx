import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { SocketContext, url } from "controller/Context";
import { randomIcon } from "common/logo";

import "assets/css/navbar.css";

const Navbar = ({ show2, setShow2 }) => {
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
    const rawNavigate =
      "/channels/" + firstChannel.serverID + "/" + firstChannel._id;
    navigate(rawNavigate);
    if (location.pathname === rawNavigate) {
      setShow2(prv => !prv);
    }
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
                if (location.pathname === "/channels/@me") {
                  setShow2(prv => !prv);
                }
              }}
            >
              <img src={randomIcon} alt="Tiscord" className="navbar-home-icon" />
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
                      src={`${url}icon/server/${server.serverpicture}`}
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
              {/* Downloads are disabled: the icon is only for show */}
              <a>
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
