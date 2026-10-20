import React from "react";
import { ReactComponent as Logo } from "assets/img/discordLogo.svg";
// `state` shows the green online dot, `offline` a grey ring in its place
const AvatarPicture = ({ picture, state, offline }) => {
  return (
    <>
      {picture ? (
        <img src={picture} alt="avatar" className="avatar-picture" />
      ) : (
        <div className="dashboard-sidebar-section-avatar">
          <Logo style={{ width: 22, height: 15 }} />
          {state && (
            <div className="dashboard-sidebar-section-avatar-state"></div>
          )}
          {!state && offline && (
            <div className="dashboard-sidebar-section-avatar-state offline"></div>
          )}
        </div>
      )}
    </>
  );
};

export default AvatarPicture;
