import axios from "axios"
import { useState } from "react";


import "assets/style/auth.css";
import { Outlet } from "react-router-dom";

const Auth = () => {
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     const { username, password } = e.target.elements;
    // }

    return(
        <>
        {/* <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Kullanıcı Adı" />
            <input type="password" name="password" placeholder="Şifre" />
            <button type="submit">Giriş</button>
        </form> */}
            <div className="auth-wrapper">
                <Outlet />
            </div>
        </>
    )
}

export default Auth;