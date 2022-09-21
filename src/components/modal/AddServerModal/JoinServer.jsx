import React from "react";
import { ReactComponent as ArrowIcon } from "assets/img/arrowIcon.svg";
import axios from "axios";

const JoinServer = ({ setStep, setShow }) => {
  const handleBack = e => {
    e.preventDefault();
    setStep(step => step - 1);
  };

  const handleNext = e => {
    e.preventDefault();
    setStep(step => step + 1);
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post("/api/server/join", {
        inviteCode: e.target.inviteCode.value,
      })
      .then(res => {
        e.target.reset();
        setShow(false);
      })
      .catch(err => {});
  };

  return (
    <>
      <div style={{ minWidth: "100%" }}>
        <form onSubmit={handleSubmit}>
          <div className="modal-firstRow">
            <div className="mymodal-header">
              <h3>Bir Sunucuya Katıl.</h3>
            </div>
            <div className="modal-subheader">
              Var olan bir sunucuya katılmak için aşağıya bir davet gir
            </div>
          </div>

          <div className="modal-input-wrapper">
            <h5 className="modal-input-label">Davet Bağlantısı</h5>
            <div>
              <input
                name="inviteCode"
                type="text"
                placeholder="https://discord.gg/hTKzmak"
                className="modal-input"
                // onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-term" style={{ flexDirection: "column" }}>
            <h5>Davetler Şöyle Görünür</h5>
            <div>hTKzmak</div>
            <div>https://discord.gg/hTKzmak</div>
            <div>https://discord.gg/cool-people</div>
          </div>
          <div className="modal-create-buttons" style={{ height: "auto" }}>
            <button
              className="modal-create-button"
              onClick={e => {
                e.preventDefault();
              }}
            >
              <div className="modal-create-button-content">
                <div>
                  <img src="/assets/img/joinserver-1.svg" alt="" />
                </div>
                <div>
                  <div
                    className="modal-create-button-content-text"
                    style={{ display: "flex" }}
                  >
                    Don't have an invite?
                  </div>
                  <div className="modal-term" style={{ padding: 0 }}>
                    Check out public communities in Server Discovery
                  </div>
                </div>
                <div className="modal-create-button-icon">
                  <ArrowIcon />
                </div>
              </div>
            </button>
          </div>
          <div
            className="modal-secondRow"
            style={{
              background: "#f2f3f5",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button className="modal-back-button" onClick={handleBack}>
              Geri
            </button>
            <button
              type="submit"
              className="modal-secondRow-button"
              // onClick={handleNext}
              style={{ background: "rgb(88,101,242)", width: "auto" }}
            >
              Sunucuya Katıl
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default JoinServer;
