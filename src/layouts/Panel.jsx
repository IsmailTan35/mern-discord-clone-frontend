import "assets/style/panel.css"
import Dashboard from "views/Dashboard";
import ServerDashboard from "views/ServerDashboard";

import Sidebar from "components/Sidebar";
import { Route, Routes,useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "controller/Context";

const Panel = () => {
    const client = useContext(SocketContext);
    const friends = useSelector(state => state.friends.items);
    const message = useSelector(state => state.user.message);
    const userID = useSelector(state => state.user.id);
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if(location.pathname === "/" || friends.filter(friend => friend.id==location.pathname.split("/")[3]).length === 0) {
            // navigate("/channels/@me")
            client.emit("configuration",{token: localStorage.getItem("accessToken")});
        }
    }, [])
    useEffect(() => {
        var counter =message.filter(items => items.from != userID && items.read==false)
        if(counter.length<1) return
        document.title = `New Message (${counter.length})`

    },[message] )
    return(
        
        <div className="panelWrapper">
            <Sidebar/>
            <Dashboard/>
        </div>
        
    )
}
export default Panel;