import "assets/style/panel.css"
import Dashboard from "views/Dashboard";
import ServerDashboard from "views/ServerDashboard";

import Sidebar from "components/Sidebar";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Panel = () => {
    const history = useHistory()
    const location = useLocation()

    useEffect(() => {
        if(location.pathname === "/"){
        history.push("/channels/@me")
    }
}, [])
    return(
        
        <div className="panelWrapper">
            <Sidebar/>
            {/* <div style={{background:"red"}}>
                <div style={{width:"72px"}}></div>
            </div>
            <div style={{display:"flex",flexDirection:"1 auto"}}>

            </div> */}
            <Route strict path="/channels/" component={Dashboard} />
            <Route path="/store" component={Dashboard} />
        </div>
        
    )
}
export default Panel;