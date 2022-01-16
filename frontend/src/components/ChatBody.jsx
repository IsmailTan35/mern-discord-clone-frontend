import { useContext } from "react"
import { useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { SocketContext } from 'controller/Context';

const ChatBody = () => {
    const client = useContext(SocketContext)
    const messages = useSelector(state => state.user.message)
    const location = useLocation()
    return(
        <>
            <div className="chat-body-wrapper">
                {messages.filter(message => message.to === location.pathname.split("/")[3] || message.from===location.pathname.split("/")[3]).map((data,index) => (
                    <div className="chat-body-message" key={index}>
                        <div className="chat-body-message-text">
                            {data.message}
                            </div>
                        </div>
                ))}
            </div>
        </>
    )
}

export default ChatBody