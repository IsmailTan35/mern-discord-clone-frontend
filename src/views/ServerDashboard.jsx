import React, { useState } from "react";
import { Route, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Avatar from "components/Avatar";
import routes from "routes";

import "assets/css/dashboard.css";

const ServerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const changeHistory = e => {
    navigate(e);
  };
  return (
    <>
      <div className="dashboard-wrapper">
        <div className="dashboard-second-wrapper">
          <div className="dashboard-sidebar">
            <nav className="dashboard-side-navbar">
              <div className="dashboard-sidebar-search-button-wrapper">
                {/* asdas */}
              </div>
            </nav>
            <div style={{ height: "8px", width: "100%" }}></div>
            <div className="dashboard-sidebar-chat-wrapper">
              <div className="dashboard-sidebar-chat-buttons-wrapper">
                {/* asdasdas */}
              </div>
            </div>
            {/* asdfsfds */}
            <Avatar />
          </div>
          <div className="dashboard-panel">
            <div className="dashboard-panel-header-wrapper">
              {/* asdasda */}
            </div>
            <div className="dashboard-panel-body-wrapper">
              {/* aklsdjaklsdkla */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ServerDashboard;
