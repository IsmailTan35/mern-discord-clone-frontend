import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { userActions } from "store";
import AvatarPicture from "components/AvatarPicture";
import DiscordModal, { ModalField } from "components/modal/DiscordModal";

import "assets/css/account.css";

// "ab*******@gmail.com", like Discord hides the address until asked
const maskEmail = email => {
  const [name, domain] = String(email || "").split("@");
  if (!domain) return email;
  return `${"*".repeat(Math.max(name.length, 4))}@${domain}`;
};

// The server answers { error, field }; an error without a field belongs to the form
const errorsFrom = (err, fallback) => {
  const data = err.response && err.response.data;
  if (data && data.error) return { [data.field || "form"]: data.error };
  return { form: fallback };
};

const EDITS = {
  username: {
    title: "Kullanıcı adını değiştir",
    subtitle: "Yeni bir kullanıcı adı ve mevcut şifreni gir.",
    field: "username",
    label: "Kullanıcı Adı",
  },
  email: {
    title: "E-posta adresini değiştir",
    subtitle: "Yeni bir e-posta adresi ve mevcut şifreni gir.",
    field: "email",
    label: "E-posta",
  },
};

const EditModal = ({ kind, account, onSaved, onClose }) => {
  const edit = EDITS[kind];
  const [value, setValue] = useState(account[edit.field] || "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = event => {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    axios
      .put("/user/me", { [edit.field]: value, password })
      .then(res => onSaved(res.data))
      .catch(err => {
        setBusy(false);
        setErrors(errorsFrom(err, "Kaydedilemedi, tekrar dene."));
      });
  };

  return (
    <DiscordModal
      title={edit.title}
      subtitle={edit.subtitle}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="dmodal-button link" onClick={onClose}>
            İptal
          </button>
          <button type="submit" form="account-edit" className="dmodal-button" disabled={busy || !value.trim() || !password}>
            Bitti
          </button>
        </>
      }
    >
      <form id="account-edit" onSubmit={submit}>
        <ModalField label={edit.label} error={errors[edit.field]}>
          <input
            autoFocus
            className="dmodal-input"
            type={kind === "email" ? "email" : "text"}
            maxLength={kind === "email" ? 254 : 32}
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        </ModalField>
        <ModalField label="Mevcut Şifre" error={errors.password}>
          <input
            className="dmodal-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </ModalField>
        {errors.form && <div className="account-form-error">{errors.form}</div>}
      </form>
    </DiscordModal>
  );
};

const PasswordModal = ({ onClose }) => {
  const [form, setForm] = useState({ password: "", newPassword: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const change = name => event => setForm({ ...form, [name]: event.target.value });

  const submit = event => {
    event.preventDefault();
    if (form.newPassword !== form.confirm) {
      setErrors({ confirm: "Şifreler eşleşmiyor." });
      return;
    }
    setBusy(true);
    setErrors({});
    axios
      .put("/user/password", { password: form.password, newPassword: form.newPassword })
      .then(() => {
        toast.success("Şifren değiştirildi. Diğer cihazlardaki oturumların kapatıldı.");
        onClose();
      })
      .catch(err => {
        setBusy(false);
        setErrors(errorsFrom(err, "Şifre değiştirilemedi, tekrar dene."));
      });
  };

  return (
    <DiscordModal
      title="Şifreni güncelle"
      subtitle="Mevcut şifreni ve yeni bir şifre gir."
      onClose={onClose}
      footer={
        <>
          <button type="button" className="dmodal-button link" onClick={onClose}>
            İptal
          </button>
          <button
            type="submit"
            form="account-password"
            className="dmodal-button"
            disabled={busy || !form.password || !form.newPassword || !form.confirm}
          >
            Bitti
          </button>
        </>
      }
    >
      <form id="account-password" onSubmit={submit}>
        <ModalField label="Mevcut Şifre" error={errors.password}>
          <input autoFocus className="dmodal-input" type="password" autoComplete="current-password" value={form.password} onChange={change("password")} />
        </ModalField>
        <ModalField label="Yeni Şifre" error={errors.newPassword}>
          <input className="dmodal-input" type="password" autoComplete="new-password" value={form.newPassword} onChange={change("newPassword")} />
        </ModalField>
        <ModalField label="Yeni Şifreyi Onayla" error={errors.confirm}>
          <input className="dmodal-input" type="password" autoComplete="new-password" value={form.confirm} onChange={change("confirm")} />
        </ModalField>
        {errors.form && <div className="account-form-error">{errors.form}</div>}
      </form>
    </DiscordModal>
  );
};

const Account = () => {
  const dispatch = useDispatch();
  const [account, setAccount] = useState(null);
  const [failed, setFailed] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [dialog, setDialog] = useState(null); // "username" | "email" | "password"

  useEffect(() => {
    let active = true;
    axios
      .get("/user/me")
      .then(res => active && setAccount(res.data))
      .catch(() => active && setFailed(true));
    return () => {
      active = false;
    };
  }, []);

  const saved = next => {
    if (next.username !== account.username) {
      dispatch(userActions.refresh({ name: "name", value: next.username }));
      toast.success("Kullanıcı adın güncellendi.");
    } else if (next.email !== account.email) {
      toast.success("E-posta adresin güncellendi.");
    }
    setAccount(next);
    setDialog(null);
  };

  if (failed) return <div className="account"><h2 className="account-title">Hesabım</h2>Hesap bilgileri alınamadı.</div>;
  if (!account) return <div className="account"><h2 className="account-title">Hesabım</h2></div>;

  return (
    <div className="account">
      <h2 className="account-title">Hesabım</h2>

      <div className="account-card">
        <div className="account-banner" />
        <div className="account-profile">
          <div className="account-avatar">
            <AvatarPicture state={true} />
          </div>
          <div className="account-name">
            {account.username}
            <span className="account-code">#{account.code}</span>
          </div>
        </div>
        <div className="account-fields">
          <div className="account-field">
            <div>
              <div className="account-field-label">Kullanıcı Adı</div>
              <div className="account-field-value">
                {account.username}
                <span className="account-code">#{account.code}</span>
              </div>
            </div>
            <button type="button" className="account-edit" onClick={() => setDialog("username")}>
              Düzenle
            </button>
          </div>
          <div className="account-field">
            <div>
              <div className="account-field-label">E-posta</div>
              <div className="account-field-value">
                {showEmail ? account.email : maskEmail(account.email)}
                <button type="button" className="account-reveal" onClick={() => setShowEmail(value => !value)}>
                  {showEmail ? "Gizle" : "Göster"}
                </button>
              </div>
            </div>
            <button type="button" className="account-edit" onClick={() => setDialog("email")}>
              Düzenle
            </button>
          </div>
        </div>
      </div>

      <div className="account-divider" />

      <h3 className="account-heading">Şifre ve Kimlik Doğrulama</h3>
      <button type="button" className="dmodal-button" onClick={() => setDialog("password")}>
        Şifreyi Değiştir
      </button>
      <p className="account-note">Şifreni değiştirdiğinde diğer cihazlardaki oturumların kapatılır.</p>

      {(dialog === "username" || dialog === "email") && (
        <EditModal kind={dialog} account={account} onSaved={saved} onClose={() => setDialog(null)} />
      )}
      {dialog === "password" && <PasswordModal onClose={() => setDialog(null)} />}
    </div>
  );
};

export default Account;
