import "assets/style/panel.css"
import Dashboard from "views/Dashboard";
import ServerDashboard from "views/ServerDashboard";

import Sidebar from "components/Sidebar";
import { Route, Routes,useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "controller/Context";
import Settings from "views/settings";

const ESCAPE_KEYS = ['27', 'Escape'];

const Panel = () => {
    const client = useContext(SocketContext);
    const friends = useSelector(state => state.friends.items);
    const message = useSelector(state => state.user.message);
    const userID = useSelector(state => state.user.id);
    const navigate = useNavigate()
    const location = useLocation()
    const [show,setShow] = useState(false)

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

    function handler({ key }){
        setShow(true)
    }

    function handler2({ key }){
        if (ESCAPE_KEYS.includes(String(key))) {
            setShow(false)
        }
    }

    function handleClick(e) {
        setShow(false)
    }
    useEffect(() => {
        document.getElementById("settings-button").addEventListener("mousedown", handler);
        document.addEventListener("keydown", handler2);

        return () => {
            document.getElementById("settings-button").removeEventListener("mousedown", handler);
            document.removeEventListener("keydown", handler2);

        }
    }, [])
    console.log(show)
    return(
        <>
            <div className={`panelWrapper${!show?"-active":""}`}>
                <Sidebar/>
                <Dashboard/>
            </div>
            <Settings data={show} setData={handleClick} />
        </>
        
    )
}
export default Panel;