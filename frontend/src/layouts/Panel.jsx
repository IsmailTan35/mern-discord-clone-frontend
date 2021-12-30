import "assets/style/panel.css"
import Dashboard from "components/Dashboard";
import Siderbar from "components/Siderbar";
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
            <Siderbar/>
            <Dashboard/>
        </div>
        
    )
}
export default Panel;