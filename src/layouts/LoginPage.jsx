import "assets/style/login.css";
import { useHistory } from "react-router-dom";

const LoginPage = () => {
    const navigate = useHistory()
    const handleClick = (url) => {
        navigate.push(url)
    }
    return(
        <>
            <div className="login-wrapper">
                <div className="login">
                    <div style={{width:"100%"}}>
                        <div className="login-header-wrapper">
                            <h3>Tekrar Hoşgeldiniz</h3>
                            <span>Seni tekrar gördüğümüze sevindik!</span>
                        </div>
                        <div className="login-email-wrapper">
                            <label>E-POSTA VEYA TELEFON NUMARASI</label>
                            <input className="login-input"/>
                        </div>
                        <div className="login-password-wrapper">
                            <label>ŞİFRE</label>
                            <input className="login-input"/>
                        </div>
                        <div>
                            <button className="login-links-button">Şifreni mi Unuttun?</button>
                        </div>
                        <div>
                            <button className="login-button"
                                onClick={()=>{handleClick("/channels/@me")}}>
                                    Giriş
                            </button>
                        </div>
                        <div>
                            <span>Bir Hesaba mı ihtiyacın var? </span>
                            <button className="login-links-button">Kaydol!</button>
                        </div>
                    </div>
                    <div style={{}} className="login-center-wrapper">
                        <div style={{margin:" 0 32px",border: "1px solid transparent"}}></div>
                    </div>
                    <div className="login-qr-wrapper">
                        <div className="login-qr"></div>
                        <h3>QR Kodu ile giriş yap</h3>
                        <div className="" style={{color:"#b9bbbe"}}>
                            {"Anında giriş yapmak için bu kodu "}
                            <strong>Discord mobil uygulaması</strong>
                            {" ile tara."}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage;