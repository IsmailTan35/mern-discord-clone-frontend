import ChatBody from "components/ChatBody"
import ChatInput from "components/ChatInput"
import ChatVideo from "components/ChatVideo"
import { useLocation } from "react-router-dom"
import { useState , useEffect, useContext, useLayoutEffect} from "react"
import axios from "axios"
import { messageActions } from "store"
import { useDispatch, useSelector } from "react-redux"
import { socketActions } from "store/socket"
import { SocketContext } from "controller/Context"
const Chat = () => {
    const socket = useContext(SocketContext)
    const dispatch = useDispatch()
    const [user, setUser] = useState({})
    const location = useLocation()

    useLayoutEffect(() => {
        const userId = location.pathname.split("/")[3]
        if(location.pathname.split("/").length!=4) return

        axios.get('/api/user/getName',{params:{
            id:userId,
            token:localStorage.getItem("token")
        }}).then(res => {
            setUser(res.data)

        })
        
        setTimeout(() => {
        socket.emit("getMessages",{
            receiver:userId,
        })}, 500);
            
    }, [location])

    return(
        <>
            <ChatVideo user={user} />
            <ChatBody user={user} />
            <ChatInput user={user} />
        </>
    )
}

export default Chat