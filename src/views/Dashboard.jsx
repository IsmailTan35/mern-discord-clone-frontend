import React, { useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { friendsRoutes } from "routes"

import Avatar from "components/Avatar"
import Store from "components/Store"
import ServerChat from "components/ServerChat"
import SidebarFriends from "components/SidebarFriends"
import StoreHeader from "components/header/StoreHeader"
import ServerHeader from "components/header/ServerHeader"
import FriendsHeader from "components/header/FriendsHeader"
import FriendsChatHeader from "components/header/FriendsChatHeader"
import SidebarServerChannels from "components/SidebarServerChannels"

import Active from "views/friendsViews/Active"
import Chat from "views/Chat"

import "assets/css/dashboard.css"

const Dashboard =()=>{
    const [friends, setFriends] = useState("online")
    const navigate = useNavigate()
    const location = useLocation()
    
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
                            <div className="dashboard-navbar-search-button-wrapper">
                                <button className="dashboard-navbar-search-button">
                                    {"Sohbet bul ya da başlat"}
                                </button>
                            </div>
                            <Routes>
                                <Route path="@me"
                                    element={<SidebarFriends friends={friends} 
                                    changeFriends={changeFriends}/>}/>
                                <Route exact strict sensitive path={"@me/:id"} 
                                    element={<SidebarFriends/>}/>
                                <Route path={":serverID/:channelID"} element={<SidebarServerChannels/>}/>
                                <Route index 
                                    element={<SidebarFriends servers={friends} 
                                        changeServers={changeFriends}/>}
                                    />
                            </Routes>
                        </nav>
                        <Avatar/>
                    </div>
                </div>
                <div className="dashboard-panel">
                    <div className="dashboard-panel-header-wrapper">
                        <Routes>
                            <Route path="@me"
                                element={<FriendsHeader friends={friends} 
                                changeFriends={changeFriends}/>}/>
                            <Route exact strict sensitive path={"@me/:id"} 
                                element={<FriendsChatHeader/>}/>
                            <Route path={":serverID/:channelID"} element={<ServerHeader/>}/>
                            <Route index 
                                element={<StoreHeader servers={friends} 
                                    changeServers={changeFriends}/>}
                                />
                        </Routes>
                    </div>
                    <div className="dashboard-panel-body-wrapper">
                        <Routes>
                            <Route path="@me" element={
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
                            <Route path={"@me/:id"} element={<Chat/>}/>
                            <Route path={":serverID/:channelID"} element={<ServerChat/>}/>
                            <Route index element={<Store/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default Dashboard;