import React, { useContext } from 'react';
import AvatarPicture from 'components/AvatarPicture';
import { useDispatch, useSelector } from 'react-redux';
import { streamActions } from 'store';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from 'controller/Context';

const CallRequest = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
    const myStoreStream = useSelector(state => state.stream.items);
	const socket = useContext(SocketContext);
	
	const rejectCall = () => {
		dispatch(streamActions.update({name:"calling",value:false}))
	}
	
	const acceptCall = () => {
		navigate(`/channels/@me/${myStoreStream.userId}`);
		dispatch(streamActions.update({name:"calling",value:false}))
        socket.emit("answerCall", {receiver: myStoreStream.callerId})

	}

	return (
		<>
			<div className='modal-container' >
				<div className={`mymodal${myStoreStream.calling ? " active":""}`} style={{background:"transparent",width:200}}>
					<div style={{}}>
						<div style={{padding:20,background:"#18191d",display:"flex",flexDirection:"column",justifyContent:"center",borderRadius:9}}>
							<div style={{height:50,margin:"auto"}}>
								<AvatarPicture state={false}/>
							</div>
							<div 
								style={{height:30,display:"flex",justifyContent:"center",alignItems:"flex-end",color:"#fff"}}>
								{myStoreStream.callerName }
							</div>
							<div 
								style={{height:50,display:"flex",justifyContent:"center",alignItems:"flex-start",color:"#"}}>
								Gelen Arama
							</div>
							<div style={{height:50,display:"flex",justifyContent:"center",columnGap:10}}>
								<div onClick={rejectCall} style={{height:50,width:50,borderRadius:"100%",background:"#f04846",display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer",color:"#fff"}}>NO</div>
								<div onClick={acceptCall} style={{height:50,width:50,borderRadius:"100%",background:"#3fb17d",display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer",color:"#fff"}}>YES</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CallRequest;