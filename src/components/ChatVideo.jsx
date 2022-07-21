import { useContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import Peer from "simple-peer";
import { SocketContext } from "controller/Context";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { streamActions } from 'store';

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Video = ({peer}) => {
    const ref = useRef();
    const [stream, setStream] = useState(null);
    useEffect(() => {
        peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <video
            muted 
            playsInline 
            autoPlay 
            ref={ref} 

            className="webRTC"
            style={{...videoConstraints}}
            controls={true}/>
    );
}


const Room = () => {
    const dispatch = useDispatch()
    const socket = useContext(SocketContext);
    const [peers, setPeers] = useState([]);
    const myStoreStream = useSelector(state => state.stream.items);

    const removePeer = (id) => {
        const item = peers.map(p => {
            if(p.peerID == id){
                p.peer.destroy();
                return p
            }
            else {

            }
        });
        if(!item) return
        setPeers(item);
    }

    useEffect(() => {
        let isMounted = true;
        socket.on("acceptedCall", data => {
            socket.on("user joined", payload => {
                if (isMounted) addPeer(payload.signal, payload.from);
            });
        })

        return () => { isMounted = false };
    }, [])

    useEffect(() => {
        let isMounted = true;

        socket.on("receiving returned signal", payload => {
            const item = peers.find(p => p.peerID == payload.from);   
            if(!item) return 
            item.peer.signal(payload.signal);
        });
        socket.on("hangup", payload => {
           removePeer(payload.from);
        })
        
        if(peers.length===0 && !isMounted) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            stream.getTracks().map(track => track.stop())
        })
        return () => {
            isMounted = false
        }}
    }, [peers])

    const answer = () => {
        socket.on("all users", users => {
            users.map(userID => {
                createPeer(userID);
            })
        })
        socket.on("hangup", payload => {
            removePeer(payload.from);
        })
        socket.emit("answerCall", {receiver: myStoreStream.callerId})
        dispatch(streamActions.update({name:"calling",value:false}))
    }

    const createPeer = (receiver)=> {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                const item = peers.find(p => p.peerID == receiver);  
                if(item) return;
                const peer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream,
                })
                peer.on("signal", signal => {
                    socket.emit("sending signal", { signal, receiver });    
                })
                peer.on("close", (e) => {
                    stream.getTracks().map(track => track.stop())
                })
                setPeers(users => [...users, { peerID: receiver, peer: peer }]);
            })
    }

    const addPeer = (incomingSignal, receiver) => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            const item = peers.find(p => p.peerID == receiver);  
            if(item) return;

            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream,
            })
            peer.signal(incomingSignal);

            peer.on("signal", signal => {
                socket.emit("returning signal", { signal:signal, receiver:receiver })
            })
            peer.on("close", () => {
                // stream.getTracks().map(track => track.stop())
            })
            
            setPeers(users => [...users, { peerID: receiver, peer: peer }]);

        })
    }

    const handleHangup = () => {
        socket.emit("hangupCall")
        peers.map(item => {
            if(!item.peer || !item.peer.streams || item.peer.streams.length <= 0) return
            item.peer.destroy()
            item.peer.streams[0].getTracks().forEach(track => track.stop())
        })
        
        setPeers([]);
    }
    
    return (
        <div style={{display:myStoreStream.calling || peers.length>0?"block":"none",height:"500px",overflowY:"scroll",backgroundColor:"rgba(0,0,0,0.8)"}} id="deneme">
            <div>
                {peers.filter(item=> item.peerID != socket.id).map((item, index) => {
                    return (
                        <Video key={index} peer={item.peer} />
                        );
                    })}
            </div>
            <div style={{display:"flex",flexGap:10}}>
                {myStoreStream.calling && <Button onClick={()=>{answer()}}>Answer</Button>}
                {peers.length>0 ? <>
                    <Button onClick={()=>handleHangup()}>
                        {`End Call`}
                    </Button>
                    <Button>
                        {`Mute`}
                    </Button>
                </>:
                null}
            </div>

        </div>
    );
};

export default Room;