import React from 'react';
import { useHistory } from 'react-router-dom';

const Register = () => {
    const navigate = useHistory()

    const handleUrl = (url) => {
        navigate.push(url)
    }
    return (
        <>
            <div className='register-wrapper'>
                <h3 className='auth-header-wrapper'>{"Bir Hesap Oluştur"}</h3>
                <div className='auth-input-wrapper'>
                    <span className='auth-input-label'>E-posta</span>
                    <input type='text' name='email' className='auth-input'/>
                </div>
                <div className='auth-input-wrapper'>
                    <span className='auth-input-label'>Kullanıcı Adı</span>
                    <input type='text' name='username' className='auth-input'/>
                </div>
                <div className='auth-input-wrapper'>
                    <span className='auth-input-label'>Şifre</span>
                    <input type='password' name='password' className='auth-input'/>
                </div>
                <div className='register-date-wrapper'>
                    <span className='auth-input-label'>Doğum Tarihi</span>
                    <div className='register-date'>
                        <input/>
                        <input/>
                        <input/>
                    </div>
                </div>
                <div className='register-'>
                    <input type="checkbox"/>
                    <p>
                    (İsteğe bağlı) Discord güncellemeleri, ipuçları ve özel teklifler için e-posta almak istiyorum. Bundan istediğin zaman vazgeçebilirsin.
                    </p>
                </div>
                <button className='auth-button'>Devam Et</button>
                <span className='auth-links-button' onClick={()=>{handleUrl("/auth/login")}}>
                    {"Zaten Hesabın var mı?"}
                </span>
            </div>
        </>
    );
};

export default Register;