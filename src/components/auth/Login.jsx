import axios from "axios";
import { SocketContext } from "controller/Context";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import discordo from "assets/audio/discordo.mpeg";
import { useDispatch } from "react-redux";
import { userActions } from "store";
const LoginPage = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const [form, setForm] = useState({
    email: "demo@discord.com",
    password: "demo",
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleClick = url => {
    const id = toast.loading("Please wait...");

    axios
      .post("/api/auth/login", form)
      .then(res => {
        localStorage.setItem("accessToken", res.data[6].value);
        dispatch(
          userActions.refresh({ name: "token", value: res.data[6].value })
        );
        socket.emit("configuration", { token: res.data[6].value });
        setTimeout(() => {
          navigate(url);
          toast.update(id, {
            render: "All is good",
            type: toast.TYPE.SUCCESS,
            isLoading: false,
            autoClose: 1500,
          });
          const audio = new Audio(discordo);
          audio.play();
        }, 500);
      })
      .catch(err => {
        setTimeout(() => {
          toast.update(id, {
            render: "All is bad",
            type: toast.TYPE.ERROR,
            isLoading: false,
            autoClose: 1500,
          });
        }, 1500);
      });
  };

  const handleUrl = url => {
    navigate(url);
    setTimeout(() => {
      toast.update(id, {
        render: "All is good",
        type: toast.TYPE.ERROR,
        isLoading: false,
        autoClose: 1500,
      });
    }, 1000);
  };

  return (
    <>
      <div className="login-wrapper">
        <div style={{ width: "100%" }}>
          <div className="auth-header-wrapper">
            <h3>Tekrar Hoşgeldiniz</h3>
            <span>Seni tekrar gördüğümüze sevindik!</span>
          </div>
          <div className="auth-input-wrapper">
            <label>E-POSTA VEYA TELEFON NUMARASI</label>
            <input
              name="email"
              className="auth-input"
              onChange={handleChange}
              value={form.email}
            />
          </div>
          <div className="auth-input-wrapper">
            <label>ŞİFRE</label>
            <input
              name="password"
              type={"password"}
              className="auth-input"
              onChange={handleChange}
              value={form.password}
            />
          </div>
          <div>
            <button
              className="auth-links-button"
              onClick={() => {
                handleUrl("/auth/forget");
              }}
            >
              Şifreni mi Unuttun?
            </button>
          </div>
          <div>
            <button
              className="auth-button"
              onClick={() => {
                handleClick("/channels/@me");
              }}
            >
              Giriş
            </button>
          </div>
          <div>
            <span>Bir Hesaba mı ihtiyacın var? </span>
            <button
              className="auth-links-button"
              onClick={() => {
                handleUrl("/auth/register");
              }}
            >
              Kaydol!
            </button>
          </div>
        </div>
        <div style={{}} className="login-center-wrapper">
          <div
            style={{ margin: " 0 32px", border: "1px solid transparent" }}
          ></div>
        </div>
        <div className="login-qr-wrapper">
          <div className="login-qr"></div>
          <h3>QR Kodu ile giriş yap</h3>
          <div className="" style={{ color: "#b9bbbe" }}>
            {"Anında giriş yapmak için bu kodu "}
            <strong>Discord mobil uygulaması</strong>
            {" ile tara."}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
