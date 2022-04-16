import React, { useState } from "react"
import { Route, useHistory } from "react-router-dom"
import routes from "routes"


import "assets/style/dashboard.css"
import { useLocation } from "react-router-dom"
import Avatar from "components/Avatar"

const ServerDashboard =()=>{
    const history = useHistory()
    const location= useLocation()


    const changeHistory = (e)=>{
        history.push(e)
    }
    return(
        <>
        <div className="dashboard-wrapper">
                <div className="dashboard-second-wrapper">
                    <div className="dashboard-sidebar">
                        <nav className="dashboard-side-navbar">
                            <div className="dashboard-sidebar-search-button-wrapper">
                                {/* asdas */}
                            </div>
                        </nav>
                            <div style={{height:"8px",width:"100%"}}></div>
                            <div className="dashboard-sidebar-chat-wrapper">
                                <div className="dashboard-sidebar-chat-buttons-wrapper">
                                    {/* asdasdas */}
                                </div>
                                {/* asdfsfds */}
                            </div>
                        <Avatar/>
                    </div>
                    <div className="dashboard-panel">
                        <div className="dashboard-panel-header-wrapper">
                           {/* asdasda */}
                        </div>
                        <div className="dashboard-panel-body-wrapper">
                            {/* aklsdjaklsdkla */}

                        
                        </div>
                    </div>
                
                </div>

            </div>
        </>
    )
}
export default ServerDashboard;