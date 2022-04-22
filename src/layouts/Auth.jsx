import { useHistory } from "react-router-dom";
import axios from "axios"
import { useState } from "react";
import { Route } from "react-router-dom";
import LoginPage from "components/auth/Login";
import Register from "components/auth/Register";

import "assets/style/auth.css";

const Auth = () => {

    return(
        <>
            <div className="auth-wrapper">
                <Route path="/auth/login" component={LoginPage}/>
                <Route path="/auth/register" component={Register}/>
                <Route path="/auth/forgot" component={Register}/>

            </div>
        </>
    )
}

export default Auth;