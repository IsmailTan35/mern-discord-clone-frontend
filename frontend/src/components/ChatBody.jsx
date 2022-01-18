import { useContext, useRef, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { SocketContext } from 'controller/Context';

const ChatBody = () => {
    const ref = useRef(null);
    const client = useContext(SocketContext)
    const user = useSelector(state => state.user)
    const messages = useSelector(state => state.user.message)
    const friends = useSelector(state => state.friends.items)
    const [friendName,SetFriendName]=useState('')
    const location = useLocation()

    useEffect(() => {
        if(!location.pathname.split("/").length==3) return
        const friend=friends.filter(friend => friend.id==location.pathname.split("/")[3])
        if(friend.length>0){
            SetFriendName(friend[0].name)
        }
            
    }, [location])

    useEffect(() => {
        ref.current.scrollTop = ref.current.scrollHeight;
    }, [messages])
    
    return(
        <>
            <div className="chat-body-wrapper" ref={ref}>
                {messages.filter(message => message.to === location.pathname.split("/")[3] || message.from===location.pathname.split("/")[3]).map((data,index) => (
                    <div className="chat-body-message" key={index}>
                        <div className="chat-body-message-avatar">
                            {"avatar"}
                        </div>
                        <div className="chat-body-message-text">
                            <div className="chat-body-message-text-name">{data.from===client.id ? user.name:friendName}</div>
                            <div className="chat-body-message-text-msg" style={{['--deneme']: "red"}}>{data.message}</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ChatBody