import { useEffect, useContext } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux'
import { useEffectAsync } from 'reactHelper'
import { userActions } from 'store';
import { friendsActions } from 'store';
import {SocketContext} from "./Context"
const SocketController = () => {
  const client = useContext(SocketContext);
  const friends = useSelector(state => state.friends.items)

  const dispatch = useDispatch()

  const connectSocket = () => {
    client.on("connect", () => {
      
    });
    
    client.on("disconnect", () => {

    });

    client.on("me", (id) => {

    })

    client.on("messages", (messages) => { 
      console.log(messages)
     });

    client.on("data",(data)=>{
      dispatch(friendsActions.refresh({name:"items",value:data.onlineUser}))
      dispatch(userActions.refresh({name:"id",value:data.id}))
      dispatch(userActions.refresh({name:"name",value:data.name}))
      dispatch(userActions.refresh({name:"code",value:data.code}))

    })
    
    client.on("user left", (user) => {
      console.log(user)
      dispatch(friendsActions.update({type:"remove",name:"items",value:user}))


    });

    client.on("user join", (user) => {
      dispatch(friendsActions.update({type:"add",name:"items",value:user}))

    });
  }

  useEffectAsync(async () => {
    connectSocket()
  }, [])

  return null
}

export default connect()(SocketController)