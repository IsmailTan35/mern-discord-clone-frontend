import React from "react";
import "assets/css/information.css";

const InformationModal = ({ setShow }) => {
  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("information", "false");
  };
  return (
    <div className="information-wrapper">
      <div className="information-container">
        <div className="information-backdrop" onClick={handleClose}></div>
        <div className="information-modal-wrapper">
          <div className="information-modal">
            <div className="information-modal-btnClose-wrapper">
              <div className="information-modal-btnClose" onClick={handleClose}>
                X
              </div>
            </div>
            <div className="information-modal-header">Giriş Bilgileri</div>
            <div className="information-modal-body">
              <div className="information-auth">
                <div className="information-auth-name">Demo 1</div>
                <div className="information-auth-email-wrapper">
                  <div>E-Posta:</div>
                  <div>demo@discord.com</div>
                </div>
                <div className="information-auth-password-wrapper">
                  <div>Şifre:</div>
                  <div>demo</div>
                </div>
              </div>
              <div className="information-auth">
                <div className="information-auth-name">Demo 2</div>
                <div className="information-auth-email-wrapper">
                  <div>E-Posta:</div>
                  <div>demo2@discord.com</div>
                </div>
                <div className="information-auth-password-wrapper">
                  <div>Şifre:</div>
                  <div>demo</div>
                </div>
              </div>
            </div>
            <div className="information-footer">
              <div>
                Aynı anda iki hesapla giriş yapıp test etmenizi tavsiye ederim.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationModal;
