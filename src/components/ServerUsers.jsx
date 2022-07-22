import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from 'controller/Context';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AvataPicture from './AvatarPicture';

import "assets/css/serverusers.css";

const ServerUsers = () => {
	const location = useLocation();
	const [users, setUsers] = useState([]);
	const socket = useContext(SocketContext);
	const token = useSelector(state => state.user.token);

	useEffect(() => {
		if(!token) return;
		socket.emit("getServerUsers",{serverId:location.pathname.split("/")[2]});

		socket.on("serverUsers",(data)=>{
			setUsers(data);
		})
	}, [token,socket.connected,location.pathname]);

	return (
		<>
			<div className="serverusers-wrapper" >
				{users && users.map((user,index)=>{
					return (
						<div className="serveruser" key={index}>
							<div>
								<AvataPicture state={true}/>
							</div>
							<div>{user.name}</div>
						</div>
					)}
				)}
			</div>
		</>
	);
};

export default ServerUsers;