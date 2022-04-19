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
                    <div>
                        <div className="login-header-wrapper">
                            <h3>Tekrar Hoşgeldiniz</h3>
                            <span>Seni tekrar gördüğümüze sevindik!</span>
                        </div>
                        <div className="login-email-wrapper">
                            <label>E-POSTA VEYA TELEFON NUMARASI</label>
                            <input/>
                        </div>
                        <div className="login-password-wrapper">
                            <label>ŞİFRE</label>
                            <input/>
                        </div>
                        <div>
                            <span>Şifreni mi Unuttun?</span>
                        </div>
                        <div>
                            <button onClick={()=>{handleClick("/channels/@me")}}>Giriş</button>
                        </div>
                        <div>
                            <span>Bir Hesaba mı ihtiyacın var? <span>Kaydol!</span></span>
                        </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                        <div style={{margin:" 0 32px",border: "1px solid rgba(79,84,92,0.48)"}}></div>
                    </div>
                    <div>
                        <div>s</div>
                        <h3>QR Kodu ile giriş yap</h3>
                        <div>
                            Anında giriş yapmak için bu kodu 
                            <strong>Discord mobil uygulaması</strong>
                            ile tara
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage;