import { useState, useContext, useLayoutEffect} from "react"

import { useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { SocketContext } from "controller/Context"

import ChatBody from "components/ChatBody"
import ChatInput from "components/ChatInput"
import ChatVideo from "components/ChatVideo"

const Chat = () => {
    const socket = useContext(SocketContext)
    const dispatch = useDispatch()
    const [user, setUser] = useState({})
    const location = useLocation()

    useLayoutEffect(() => {
        const rawLocation = location.pathname.split("/")
        const messageType = rawLocation.includes("@me")

        const userId = rawLocation[2]
        const serverID = rawLocation[2]
        const channelID = rawLocation[3]

        setTimeout(() => {
            socket.emit("getMessages",{
                receiver:messageType ? userId : null,
                serverName: messageType ? null : serverID,
                channelName: messageType ? null : channelID,
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