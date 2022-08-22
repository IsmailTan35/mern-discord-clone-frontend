import React from "react";
import { ReactComponent as Logo } from "assets/img/discordLogo.svg";
const AvatarPicture = ({ picture, state }) => {
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
        </div>
      )}
    </>
  );
};

export default AvatarPicture;
