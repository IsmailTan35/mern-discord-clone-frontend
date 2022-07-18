import axios from "axios"
import { useState } from "react";


import "assets/style/auth.css";
import { Outlet } from "react-router-dom";

const Auth = () => {

    return(
        <>
            <div className="auth-wrapper">
                <Outlet />
            </div>
        </>
    )
}

export default Auth;