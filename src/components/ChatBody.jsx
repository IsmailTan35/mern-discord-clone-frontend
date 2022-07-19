import { useContext, useRef, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { SocketContext } from 'controller/Context';
import AvataPicture from "./AvatarPicture";
import { format } from "date-fns"
import { Tooltip,OverlayTrigger } from "react-bootstrap";

const delay={ show: 50, hide: 0 }

const ChatBody = ({user}) => {
    const ref = useRef(null);
    const socket = useContext(SocketContext)
    const rawMessages = useSelector(state => state.message.items)
    const [friendName,setFriendName]=useState('')
    const location = useLocation()
    const myUser = useSelector(state => state.user)
    const [messages,setMessages]=useState([])

    useEffect(() => {
        ref.current.scrollTop = ref.current.scrollHeight;
    }, [messages])

    useEffect(() => {
        if(!location.pathname.split("/")[3]) return
        const userId = location.pathname.split("/")[3]
        setFriendName(userId)
    }, [location])
        
    useEffect(() => {
        const parsedLocation = location.pathname.split("/")
        if(parsedLocation.includes("@me")){
            const data = rawMessages.filter(message => 
                message.sender === parsedLocation[3] || 
                message.receiver === parsedLocation[3] ||
                message.sender === myUser.id ||
                message.receiver === myUser.id
                )
            setMessages(data)
        }
        else{
            const data = rawMessages.filter(message => 
                message.serverName == parsedLocation[2] &&
                message.channelName == parsedLocation[3]
            )
            console.log(data)
            setMessages(data)
        }
    }, [rawMessages,location])
    return(
        <>
            <div className="chat-body-wrapper" ref={ref}>
                {messages.map((message,index) => (
                    <div className="chat-body-message" key={index}>
                        <div className="chat-body-message-avatar">
                            <AvataPicture/>
                        </div>
                        <div className="chat-body-message-text">
                            <div style={{display:"flex",flexDirection:"row",columnGap:"10px"}}>
                                <div className="chat-body-message-text-name">
                                    {friendName && message.sender===friendName ? user.name:myUser.name}
                                </div>
                                <div>
                                <OverlayTrigger
                                    placement="top"
                                    delay={delay}
                                    overlay={(props) => (
                                        <Tooltip {...props}>
                                        {format(new Date(message.timestamps),"EEEE, dd MMMM yyyy HH:mm")}
                                        </Tooltip>
                                    )}
                                    >
                                        <div>
                                            {format(new Date(message.timestamps),"dd.MM.yyyy")}
                                        </div>

                                </OverlayTrigger>

                                </div>

                            </div>

                            <div className="chat-body-message-text-msg" style={{['--deneme']: "#dcddde"}}>{message.message}</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ChatBody