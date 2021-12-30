import "assets/style/panel.css"
import { useState ,useLayoutEffect } from "react";

const Panel = () => {
    const [height,setHeight] = useState(window.innerHeight);
    const [width,setWidth] = useState(window.innerWidth);
    useLayoutEffect(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
    })
    return(
        
        <div className="panelWrapper" style={{height:window.innerHeight,width:window.innerWidth}}>
            <div className="sidebar">
                <div className="sidebarCircle"/>
                <div className="sidebar-online-user">9 Online</div>
                <div className="sidebarLine">
                    <span></span>
                </div>
                <div className="sidebarUserCircle">
                    <div className="sidebar-header-title">
                    </div>
                </div>
                <div className="sidebarUserCircle">
                    <div className="sidebar-header-title">
                    </div>
                </div>
                <div className="sidebarAddUser">
                    <span></span>
                    <span></span>

                </div>
            </div>
            <div className="dashboard-wrapper">
                <div>
                    <div className="dashboard-sidebar">

                    </div>
                </div>
            </div>
        </div>
        
    )
}
export default Panel;