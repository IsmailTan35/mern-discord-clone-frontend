import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const navigate = useNavigate()
    const [ form, setForm ] =useState({
        username: '',
        email: '',
        password: '',
    })
    const handleUrl = (url) => {
        navigate(url)
    }

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const id = toast.loading('Please wait...')

        axios.post('/api/auth/register', form)
        .then(res => {
            setTimeout(() => {
                toast.update(id, { render: "All is good", type: toast.TYPE.SUCCESS, isLoading: false, autoClose:1500});
            }, 500);
        })
        .catch(err => {
            setTimeout(() => {
                toast.update(id, { render: "All is good", type: toast.TYPE.ERROR, isLoading: false, autoClose:1500});
            }, 500);
        })
    }

    return (
        <>
        <div style={{borderColor:"rgba(32, 34, 37, 0.5)",borderStyle:"solid"}}></div>
            <div className='register-wrapper'>
                <h3 className='auth-header-wrapper'>{"Bir Hesap Oluştur"}</h3>
                <div className='auth-input-wrapper'>
                    <span className='auth-input-label'>E-posta</span>
                    <input type='text' name='email' className='auth-input' onChange={handleChange}/>
                </div>
                <div className='auth-input-wrapper'>
                    <span className='auth-input-label'>Kullanıcı Adı</span>
                    <input type='text' name='username' className='auth-input' onChange={handleChange}/>
                </div>
                <div className='auth-input-wrapper'>
                    <span className='auth-input-label'>Şifre</span>
                    <input type='password' name='password' className='auth-input' onChange={handleChange}/>
                </div>
                <div className='register-date-wrapper'>
                    <span className='auth-input-label'>Doğum Tarihi</span>
                    <div className='register-date'>
                        <div>
                            <input placeholder='Seç'/>
                            <div>

                            </div>
                            {/* <div>
                                <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-19bqh2r">
                                    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                                </svg>
                            </div> */}
                        </div>
                        <div>
                            <input placeholder='Seç'/>
                            <div></div>
                            {/* <div>
                                <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-19bqh2r">
                                    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                                </svg>
                            </div> */}
                        </div>                        
                        <div>
                            <input placeholder='Seç'/>
                            <div></div>
                            {/*<div>
                             <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-19bqh2r">
                                    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                                </svg>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className='register-term-wrapper'>
                    <input type="checkbox" className='register-term-checkbox'/>
                    <p className='register-term-text'>
                    (İsteğe bağlı) Discord güncellemeleri, ipuçları ve özel teklifler için e-posta almak istiyorum. Bundan istediğin zaman vazgeçebilirsin.
                    </p>
                </div>
                <button className='auth-button' onClick={handleSubmit}>Devam Et</button>
                <span className='auth-links-button' onClick={()=>{handleUrl("/auth/login")}}>
                    {"Zaten Hesabın var mı?"}
                </span>
            </div>
        </>
    );
};

export default Register;