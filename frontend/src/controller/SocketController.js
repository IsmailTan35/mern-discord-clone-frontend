import { useEffect, useContext } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux'
import { userActions } from 'store';
import { friendsActions, streamActions } from 'store';
import {SocketContext} from "./Context"

const SocketController = () => {
  const client = useContext(SocketContext);
  const friends = useSelector(state => state.friends.items);
  const unRead= useSelector(state => state.user.unRead);
  const dispatch = useDispatch()

  const connectSocket = () => {
    client.on("connect", () => {
    });
    
    client.on("disconnect", () => {
      });

    client.on("messages", (messages) => { 
      dispatch(userActions.update({name:"message",value:messages}))
     });

    client.on("data",(data)=>{
      dispatch(friendsActions.refresh({name:"items",value:data.onlineUser}))
      dispatch(userActions.refresh({name:"id",value:data.id}))
      dispatch(userActions.refresh({name:"name",value:data.name}))
      dispatch(userActions.refresh({name:"code",value:data.code}))
      dispatch(userActions.refresh({name:"message",value:data.messages}))
    })
    
    client.on("user left", (user) => {
      dispatch(friendsActions.update({type:"remove",name:"items",value:user}))
    });

    client.on("user join", (user) => {
      dispatch(friendsActions.update({type:"add",name:"items",value:user}))

    });
    client.on("calling", (user) => {
      dispatch(streamActions.update({name:"calling",value:true}))
      dispatch(streamActions.update({name:"callerId",value:user.from}))
      dispatch(streamActions.update({name:"callerName",value:user.name}))
    })
  }

  useEffect( () => {
    connectSocket()
  }, [])

  return null
}

export default connect()(SocketController)