
// import DashboardPage from "views/Dashboard/Dashboard"
import FriendsAdd from "views/friendsViews/Add"
import FriendsAll from "views/friendsViews/All"
import FriendsBlocked from "views/friendsViews/Blocked"
import FriendsOnline from "views/friendsViews/Online"
import FriendsWaiting from "views/friendsViews/Waiting"

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Güncel Durum",
    icon: "dashboard",
    component: FriendsWaiting,
    layout: "/admin",
  },  
]

const friendsRoutes = {
    add: <FriendsAdd/>,
    online: <FriendsOnline/>,
    all: <FriendsAll/>,
    blocked: <FriendsBlocked/>,
    waiting: <FriendsWaiting/>,
  }


export {
  dashboardRoutes, 
  friendsRoutes
}
