// The backend answers errors in English with a stable `code`; these are the
// texts shown for them. An unknown code falls back to the server's message.
const MESSAGES = {
  // Account settings
  sessionNotFound: "Oturum bulunamadı.",
  accountLoadFailed: "Hesap bilgileri alınamadı.",
  wrongPassword: "Şifre yanlış.",
  invalidUsername: "Kullanıcı adı 2-32 karakter olmalı ve @ # : ` içermemeli.",
  usernameTaken: "Bu kullanıcı adı alınmış.",
  invalidEmail: "Geçerli bir e-posta adresi gir.",
  emailTaken: "Bu e-posta adresi başka bir hesapta kayıtlı.",
  accountUpdateFailed: "Hesap güncellenemedi.",
  wrongCurrentPassword: "Mevcut şifre yanlış.",
  passwordTooShort: "Yeni şifre en az 6 karakter olmalı.",
  passwordChangeFailed: "Şifre değiştirilemedi.",
  // Channel management
  noCreatePermission: "Bu sunucuda kanal oluşturma yetkin yok.",
  noEditPermission: "Bu kanalı düzenleme yetkin yok.",
  noDeletePermission: "Bu kanalı silme yetkin yok.",
  invalidChannelName: "Geçerli bir kanal adı gir.",
  lastTextChannel: "Sunucunun son metin kanalı silinemez.",
  unknown: "Bir hata oluştu, tekrar dene.",
};

const serverError = data => (data && MESSAGES[data.code]) || (data && data.error);

export default serverError;
