import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from 'controller/Context';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AvatarPicture from './AvatarPicture';

import "assets/css/serverusers.css";

const ServerUsers = () => {
	const location = useLocation();
	const [users, setUsers] = useState([]);
	const socket = useContext(SocketContext);
	const token = useSelector(state => state.user.token);

	useEffect(() => {
		if(!token) return;
		socket.emit("getServerUsers",{serverId:location.pathname.split("/")[2]});


	}, [token,socket.connected,location.pathname]);

	useEffect(() => {
		socket.on("serverUsers",(data)=>{
			setUsers(data);
		})
	}, []);
	return (
		<>
			<div className="serverusers-wrapper" >
				{users && users.map((user,index)=>{
					return (
						<div className="serveruser" key={index}>
							<div>
								<AvatarPicture state={true}/>
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