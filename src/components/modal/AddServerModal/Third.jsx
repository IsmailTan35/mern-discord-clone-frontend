import axios from "axios";
import React from "react";
import { ReactComponent as CloseIcon } from "assets/img/closeIcon.svg";
import { useState } from "react";

const Third = ({ setStep, setShow }) => {
  const [image, setImage] = useState(null);
  const handleBack = e => {
    e.preventDefault();
    setStep(step => step - 1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("serverName", e.target.serverName.value);
    formData.set("serverPhoto", e.target.serverPhoto.files[0]);

    try {
      await axios.post("/server", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      setShow(false);
      e.target.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = e => {
    e.preventDefault();
  };

  const handleChangeImage = e => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <>
      <div style={{ minWidth: "100%", position: "relative" }}>
        <div className="modal-close-icon">
          <CloseIcon style={{ pointerEvents: "none" }} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-firstRow">
            <div className="mymodal-header">
              <div>Sunucunu özelleştir.</div>
            </div>
            <div className="modal-subheader">
              Yeni sunucuna bir isim ve simge ekleyerek ona kişilik kat. Bunları
              istediğin zaman değişirebilirsin.
            </div>
          </div>
          <div className="modal-upload-button-wrapper">
            <img
              src={image ? image : "/assets/img/upload.svg"}
              alt=""
              style={{
                position: "absolute",
                borderRadius: "100%",
                borderRadius: image ? "100%" : "0",
              }}
            />
            <input
              type="file"
              id="serverPhoto"
              name="serverPhoto"
              className="modal-upload-button"
              style={{ position: "absolute" }}
              onChange={handleChangeImage}
              accept="image/*"
            />
          </div>
          <div className="modal-input-wrapper">
            <h5 className="modal-input-label">Sunucu Adı</h5>
            <div>
              <input
                name="serverName"
                type="text"
                placeholder="Sunucu Adı"
                className="modal-input"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-term">
            Bir sunucu oluşturark, Discord'un Topluluk İlkelerini kabul etmiş
            olursun.
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
              style={{ background: "rgb(88,101,242)", width: "auto" }}
            >
              Oluştur
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Third;
