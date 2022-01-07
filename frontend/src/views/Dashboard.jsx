import React, { useState } from "react"
import { Route, BrowserRouter, useHistory } from "react-router-dom"
import Active from "views/friendsViews/Active"
import routes from "routes"
import EmptyFriends from "components/EmptyFriends"
import FriendsHeader from "components/header/FriendsHeader"
import StoreHeader from "components/header/StoreHeader"

import "assets/style/dashboard.css"
import { useLocation } from "react-router-dom"
import Avatar from "components/Avatar"
import FriendsChatHeader from "components/header/FriendsChatHeader"
import Chat from "views/Chat"
import Friends from "components/Friends"
const Dashboard =()=>{
    const [friends, setFriends] = useState("online")
    const history = useHistory()

    const changeFriends = (e)=>{
        setFriends(e)
        return
    }

    const changeHistory = (e)=>{
        history.push(e)
        if(e==="/channels/@me") setFriends("online")
        else setFriends(null)
    }
    return(
        <>
        <div className="dashboard-wrapper">
                <div className="dashboard-second-wrapper">
                    <div className="dashboard-sidebar">
                        {/* <nav className="dashboard-side-navbar">
                            <div className="dashboard-sidebar-search-button-wrapper">
                                <button className="dashboard-sidebar-search-button">
                                    {"Sohbet bul ya da başlat"}
                                </button>
                            </div>
                        <Friends/>
                        </nav>
                        <Avatar/> */}
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
                                <Route exact strict sensitive path={"/channels/@me/:id"}>
                                    <FriendsChatHeader/>
                                </Route>
                                <Route exact strict sensitive path={"/channels/@me"}>
                                    <FriendsHeader friends={friends} changeFriends={changeFriends}/>:
                                </Route>
                                <Route exact strict sensitive path={"/store"}>
                                    <StoreHeader servers={friends} changeServers={changeFriends}/>
                                </Route>
                        </div>
                        <div className="dashboard-panel-body-wrapper">
                            <Route exact strict sensitive path={"/channels/@me"}>
                                {friends &&
                                    <>
                                    <div className="friends-wrapper">
                                        <div className="friends-add-wrapper">
                                            <Route
                                            component={routes.friendsRoutes[friends]}
                                            key={1}
                                            />
                                        </div>
                                        <Active/>
                                    </div>
                                    </>
                                }
                            </Route>
                            <Route exact strict sensitive path={"/channels/@me/:id"}>
                                <Chat/>
                            </Route>
                        </div>
                    </div>
                
                </div>

            </div>
        </>
    )
}
export default Dashboard;