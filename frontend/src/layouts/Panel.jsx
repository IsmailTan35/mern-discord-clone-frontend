import "assets/style/panel.css"
import Dashboard from "views/Dashboard";
import ServerDashboard from "views/ServerDashboard";

import Sidebar from "components/Sidebar";
import { Redirect, Route, Switch } from "react-router-dom";

const Panel = () => {

    return(
        
        <div className="panelWrapper">
            <Sidebar/>
            {/* <div style={{background:"red"}}>
                <div style={{width:"72px"}}></div>
            </div>
            <div style={{display:"flex",flexDirection:"1 auto"}}>

            </div> */}
            <Switch>
                <Route path="/channels/@me" component={Dashboard} />
                <Route path="/store" component={Dashboard} />
            </Switch>
        </div>
        
    )
}
export default Panel;