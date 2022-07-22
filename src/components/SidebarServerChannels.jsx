import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as HashIcon } from 'assets/img/hashIcon.svg';
import { ReactComponent as VoiceIcon } from 'assets/img/voiceIcon.svg';
import { ReactComponent as AddIcon } from 'assets/img/addIcon.svg';
import { ReactComponent as ArrowIcon } from 'assets/img/arrowIcon.svg';

import "assets/css/channels.css"

const SidebarServerChannels = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const serverList = useSelector(state => state.server.items);
	const [server, setServer] = useState({});

	const handleClick = (direction) => {
		navigate(direction)
	}

	useEffect(() => {
		// if (location.pathname.split('/').length !== 4) return;
		if(serverList.length==0) return
		const serverId = location.pathname.split('/')[2];
		const parsed = serverList.filter(server => server._id === serverId);
		if (parsed.length===0) return;
		const result = parsed[0].channels.reduce((r,a)=>{
			r[a.group] = r[a.group] || [];
			r[a.group].push(a)
			return r;
		},Object.create(null));
		setServer(result);
	}, [location, serverList]);

	return (
		<>
			<div className="channels-wrapper">
				{server && Object.entries(server).length > 0 &&
					Object.keys(server).map((group,index) => {
						return (
							<div key={index} className="channels-group-wrapper">
								<div className="channels-group-header" >
									<div className='channels-group-header-context'>
										<div>
											<ArrowIcon/>
										</div>
										<div className='channels-group-header-text'>
											{group}
										</div>
									</div>
									<div className='channels-group-header-add'>
										<AddIcon />
									</div>
								</div>
								<div className='channels-group-body'>
									{server[group].map(channel => {
										return (
											<div key={channel._id} 
												className="channel-wrapper"
												onClick={()=>{handleClick(`/channels/${location.pathname.split('/')[2]}/${channel._id}`)}} >
												<div>
													{
														channel.type === "text" ?
														<HashIcon style={{width:"16px",height:"16px",marginRight:"8px"}}/>:
														<VoiceIcon style={{width:"16px",height:"16px",marginRight:"8px"}}/>
													}
												</div>
												<div></div>
												{channel.channelName}
											</div>
										);
									})}
								</div>
							</div>
						);
					})
				}

			</div>
		</>
	);
};

export default SidebarServerChannels;