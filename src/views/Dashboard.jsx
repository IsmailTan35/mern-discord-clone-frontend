import React, { useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import Active from "views/friendsViews/Active"
import FriendsHeader from "components/header/FriendsHeader"
import StoreHeader from "components/header/StoreHeader"
import {friendsRoutes} from "routes"
import "assets/style/dashboard.css"
import { useLocation } from "react-router-dom"
import Avatar from "components/Avatar"
import FriendsChatHeader from "components/header/FriendsChatHeader"
import Chat from "views/Chat"
import Friends from "components/Friends"

const Dashboard =()=>{
    const [friends, setFriends] = useState("online")
    const navigate = useNavigate()

    const changeFriends = (e)=>{
        setFriends(e)
    }

    const changeHistory = (e)=>{
        navigate(e)
        if(e==="/channels/@me") setFriends("online")
        else setFriends(null)
    }
    return(
        <>
        <div className="dashboard-wrapper">
            <div className="dashboard-second-wrapper">
                <div className="dashboard-sidebar">
                    <div id="container" >
                        <nav className="dashboard-side-navbar">
                            <div className="dashboard-sidebar-search-button-wrapper">
                                <button className="dashboard-sidebar-search-button">
                                    {"Sohbet bul ya da başlat"}
                                </button>
                            </div>
                            <Friends/>
                        </nav>
                        <Avatar/>
                    </div>
                </div>
                <div className="dashboard-panel">
                    <div className="dashboard-panel-header-wrapper">
                        <Routes>
                            <Route exact strict sensitive path={"@me"} element={<FriendsHeader friends={friends} changeFriends={changeFriends}/>}/>
                            <Route exact strict sensitive path={"@me/:id"} element={<FriendsChatHeader/>}/>
                            <Route exact strict sensitive path={"/store"} element={<StoreHeader servers={friends} changeServers={changeFriends}/>}/>
                        </Routes>
                    </div>
                    <div className="dashboard-panel-body-wrapper">
                        <Routes>
                            <Route exact strict sensitive path={"@me"} element={
                                friends &&
                                <>
                                <div className="friends-wrapper">
                                    <div className="friends-add-wrapper">
                                        {friendsRoutes[friends]}
                                    </div>
                                    <Active/>
                                </div>
                                </>
                            }/>
                            <Route exact strict sensitive path={"@me/:id"} element={<Chat/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default Dashboard;