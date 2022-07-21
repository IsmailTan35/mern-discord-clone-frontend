import React, { useState, useEffect,useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { SocketContext } from "controller/Context"
import { ReactComponent as VoiceIcon } from "assets/img/voiceIcon.svg"
import { ReactComponent as HashIcon } from "assets/img/hashIcon.svg"

const delay={ show: 50, hide: 0 }

const ServerHeader = () => {
	const location = useLocation()
  const navigate = useNavigate()
	const [server, setServer] = useState({})
	const serverList = useSelector(state => state.server.items)

	useEffect(() => {
		if(serverList.length===0) return
		const server = serverList.filter(server => server._id === location.pathname.split("/")[2])
    if(server.length===0) return navigate("/channels/@me")
    const channel = server[0].channels.filter(channel => channel._id === location.pathname.split("/")[3])
    if(channel.length===0) return navigate("/channels/@me")
		setServer(channel[0])
    
	}, [serverList,location])

	return (
		<>
		<div className="header-friend-wrapper">
      {server && server.type=="text" ?
        <HashIcon className="header-friend-icon" /> : 
        <VoiceIcon className="header-friend-icon" />}
        </div>
        <div className="header-friend-name" >
            {`${server ? server.channelName : "No Server"}`}
        </div>
        <div className="header-friend-right-wrapper">
            <OverlayTrigger
                placement="bottom"
                delay={delay}
                overlay={(props) => (
                    <Tooltip {...props}>
                      {`Alt Başlık`}
                    </Tooltip>
                  )}
                >
                <div onClick={()=>{voiceChat()}}>
				<svg x="0" y="0" className="icon-2xnN2Y" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M5.43309 21C5.35842 21 5.30189 20.9325 5.31494 20.859L5.99991 17H2.14274C2.06819 17 2.01168 16.9327 2.02453 16.8593L2.33253 15.0993C2.34258 15.0419 2.39244 15 2.45074 15H6.34991L7.40991 9H3.55274C3.47819 9 3.42168 8.93274 3.43453 8.85931L3.74253 7.09931C3.75258 7.04189 3.80244 7 3.86074 7H7.75991L8.45234 3.09903C8.46251 3.04174 8.51231 3 8.57049 3H10.3267C10.4014 3 10.4579 3.06746 10.4449 3.14097L9.75991 7H15.7599L16.4523 3.09903C16.4625 3.04174 16.5123 3 16.5705 3H18.3267C18.4014 3 18.4579 3.06746 18.4449 3.14097L17.7599 7H21.6171C21.6916 7 21.7481 7.06725 21.7353 7.14069L21.4273 8.90069C21.4172 8.95811 21.3674 9 21.3091 9H17.4099L17.0495 11.04H15.05L15.4104 9H9.41035L8.35035 15H10.5599V17H7.99991L7.30749 20.901C7.29732 20.9583 7.24752 21 7.18934 21H5.43309Z"></path><path fill="currentColor" d="M13.4399 12.96C12.9097 12.96 12.4799 13.3898 12.4799 13.92V20.2213C12.4799 20.7515 12.9097 21.1813 13.4399 21.1813H14.3999C14.5325 21.1813 14.6399 21.2887 14.6399 21.4213V23.4597C14.6399 23.6677 14.8865 23.7773 15.0408 23.6378L17.4858 21.4289C17.6622 21.2695 17.8916 21.1813 18.1294 21.1813H22.5599C23.0901 21.1813 23.5199 20.7515 23.5199 20.2213V13.92C23.5199 13.3898 23.0901 12.96 22.5599 12.96H13.4399Z"></path></svg>
                </div>
            </OverlayTrigger>
            <OverlayTrigger
                placement="bottom"
                delay={delay}
                overlay={(props) => (
                    <Tooltip {...props}>
                      {`Bildirim Ayarları`}
                    </Tooltip>
                  )}
                >
                <div onClick={()=>{videoChat()}}>
				<svg x="0" y="0" className="icon-2xnN2Y" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M18 9V14C18 15.657 19.344 17 21 17V18H3V17C4.656 17 6 15.657 6 14V9C6 5.686 8.686 3 12 3C15.314 3 18 5.686 18 9ZM11.9999 21C10.5239 21 9.24793 20.19 8.55493 19H15.4449C14.7519 20.19 13.4759 21 11.9999 21Z"></path></svg>
                </div>
            </OverlayTrigger>
            <OverlayTrigger
                placement="bottom"
                delay={delay}
                overlay={(props) => (
                    <Tooltip {...props}>
                      {`Üye Listesini Gizle`}
                    </Tooltip>
                  )}
                >
                <div>
                    <svg x="0" y="0" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22 12L12.101 2.10101L10.686 3.51401L12.101 4.92901L7.15096 9.87801V9.88001L5.73596 8.46501L4.32196 9.88001L8.56496 14.122L2.90796 19.778L4.32196 21.192L9.97896 15.536L14.222 19.778L15.636 18.364L14.222 16.95L19.171 12H19.172L20.586 13.414L22 12Z"></path>
                    </svg>
                </div>
            </OverlayTrigger>
            <OverlayTrigger
                placement="bottom"
                delay={delay}
                overlay={(props) => (
                    <Tooltip {...props}>
                      {`DM'ye Arkadaş Ekle`}
                    </Tooltip>
                  )}
                >
                <div>
				<svg x="0" y="0" className="icon-2xnN2Y" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M14 8.00598C14 10.211 12.206 12.006 10 12.006C7.795 12.006 6 10.211 6 8.00598C6 5.80098 7.794 4.00598 10 4.00598C12.206 4.00598 14 5.80098 14 8.00598ZM2 19.006C2 15.473 5.29 13.006 10 13.006C14.711 13.006 18 15.473 18 19.006V20.006H2V19.006Z"></path><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M14 8.00598C14 10.211 12.206 12.006 10 12.006C7.795 12.006 6 10.211 6 8.00598C6 5.80098 7.794 4.00598 10 4.00598C12.206 4.00598 14 5.80098 14 8.00598ZM2 19.006C2 15.473 5.29 13.006 10 13.006C14.711 13.006 18 15.473 18 19.006V20.006H2V19.006Z"></path><path fill="currentColor" d="M20.0001 20.006H22.0001V19.006C22.0001 16.4433 20.2697 14.4415 17.5213 13.5352C19.0621 14.9127 20.0001 16.8059 20.0001 19.006V20.006Z"></path><path fill="currentColor" d="M14.8834 11.9077C16.6657 11.5044 18.0001 9.9077 18.0001 8.00598C18.0001 5.96916 16.4693 4.28218 14.4971 4.0367C15.4322 5.09511 16.0001 6.48524 16.0001 8.00598C16.0001 9.44888 15.4889 10.7742 14.6378 11.8102C14.7203 11.8418 14.8022 11.8743 14.8834 11.9077Z"></path></svg>
                </div>
            </OverlayTrigger>
            <div className="header-chat-search-input-wrapper">
                <input placeholder="Ara"></input>    
            </div>
            <OverlayTrigger
                placement="bottom"
                delay={delay}
                overlay={(props) => (
                    <Tooltip {...props}>
                      {`Genel Kutusu`}
                    </Tooltip>
                  )}
                >
                <div>
                    <svg x="0" y="0" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M19 3H4.99C3.88 3 3.01 3.89 3.01 5L3 19C3 20.1 3.88 21 4.99 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3ZM19 15H15C15 16.66 13.65 18 12 18C10.35 18 9 16.66 9 15H4.99V5H19V15Z" fill="currentColor"></path>
                    </svg>
                </div>
            </OverlayTrigger>
            <OverlayTrigger
                placement="bottom"
                delay={delay}
                overlay={(props) => (
                    <Tooltip {...props}>
                      {`Yardım`}
                    </Tooltip>
                  )}
                >
                <div>
                    <svg x="0" y="0" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C6.486 2 2 6.487 2 12C2 17.515 6.486 22 12 22C17.514 22 22 17.515 22 12C22 6.487 17.514 2 12 2ZM12 18.25C11.31 18.25 10.75 17.691 10.75 17C10.75 16.31 11.31 15.75 12 15.75C12.69 15.75 13.25 16.31 13.25 17C13.25 17.691 12.69 18.25 12 18.25ZM13 13.875V15H11V12H12C13.104 12 14 11.103 14 10C14 8.896 13.104 8 12 8C10.896 8 10 8.896 10 10H8C8 7.795 9.795 6 12 6C14.205 6 16 7.795 16 10C16 11.861 14.723 13.429 13 13.875Z"></path>

                    </svg>
                </div>
            </OverlayTrigger>
        </div>
		</>
	);
};

export default ServerHeader;