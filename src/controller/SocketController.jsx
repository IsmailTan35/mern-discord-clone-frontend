import { useEffect, useContext, useLayoutEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux'
import { messageActions } from 'store';
import { userActions } from 'store';
import { friendsActions, streamActions, friendRequestActions } from 'store';
import {SocketContext} from "./Context"
import { useLocation } from 'react-router-dom';
import { serversActions } from 'store';

const SocketController = () => {
  const client = useContext(SocketContext);
  const token = useSelector(state => state.user.token);
  const location = useLocation();
  const dispatch = useDispatch()

  const connectSocket = () => {
    client.on("connect", () => {
      if(location.pathname !== "/" ) {
        // navigate("/channels/@me")
        client.emit("configuration",{token: localStorage.getItem("accessToken")});
    }
    });
    
    client.on("disconnect", () => {
    });

    client.on("reconnect", () => {
        if(location.pathname !== "/" ) {
            // navigate("/channels/@me")
            client.emit("configuration",{token: localStorage.getItem("accessToken")});
        }
    });

    client.on("reconnect_attempt", () => {
    })
    
    client.on("newMessage", (message) => { 
        dispatch(messageActions.overWrite({name:"items",value:message}))
     });

    client.on("data",(data)=>{
      dispatch(friendsActions.refresh({name:"onlineUsers",value:data.onlineUsers}))
      dispatch(userActions.refresh({name:"id",value:data.id}))
      dispatch(userActions.refresh({name:"name",value:data.name}))
      dispatch(userActions.refresh({name:"code",value:data.code}))
      // dispatch(userActions.refresh({name:"message",value:data.messages}))
    })
    
    client.on("friendLeft", (user) => {
      dispatch(friendsActions.update({type:"remove",name:"onlineUsers",value:user}))
    });

    client.on("friendJoin", (user) => {
      if(!user.userId) return
      dispatch(friendsActions.update({type:"add",name:"onlineUsers",value:user}))

    });
    
    client.on("calling", (user) => {
      dispatch(streamActions.update({name:"calling",value:true}))
      dispatch(streamActions.update({name:"callerId",value:user.from}))
      dispatch(streamActions.update({name:"callerName",value:user.name}))
    })

    client.on('friendRequests',(data)=>{
      dispatch(friendsActions.refresh({type:"add",name:"requests",value:data}))
    })

    client.on('friendRequestsRemove',(data)=>{
      dispatch(friendsActions.update({type:"remove",name:"requests",value:data}))
    })

    client.on("newFriendRequest",(data)=>{
      dispatch(friendsActions.update({type:"add",name:"requests",value:data}))
    })
    
    client.on('friends',(data)=>{
      dispatch(friendsActions.refresh({type:"add",name:"all",value:data}))
    })

    client.on('friendUnFriend',(data)=>{
      dispatch(friendsActions.update({type:"remove",name:"all",value:data}))
    })

    client.on("newFriend",(data)=>{
      dispatch(friendsActions.update({type:"add",name:"all",value:data}))
    })
    
    client.on('friendBlockeds',(data)=>{
      dispatch(friendsActions.refresh({type:"add",name:"blocked",value:data}))
    })

    client.on('friendAll',(data)=>{
      dispatch(friendsActions.refresh({type:"add",name:"all",value:data}))
    })

    client.on('deneme',(data)=>{
      console.log(data)
    })

    client.on('serverList',(data)=>{
      // dispatch(serversActions.refresh({type:"add",name:"items",value:data}))
    })
  }

  useEffect( () => {
      if(!token) return
      connectSocket()
  }, [token])

  return null
}

export default connect()(SocketController)