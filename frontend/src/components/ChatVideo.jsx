import { useContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import Peer from "simple-peer";
import { SocketContext } from "controller/Context";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { streamActions } from 'store';

const Video = (props) => {
    const ref = useRef();
    
    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <video muted playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};


const Room = () => {
    const myStoreStream = useSelector(state => state.stream.items);
    const [peers, setPeers] = useState([]);
    const client = useContext(SocketContext);
    const dispatch = useDispatch()
    const peersRef = useRef([]);

    useEffect(() => {
        let isMounted = true;
        client.on("acceptedCall", data => {
            client.on("user joined", payload => {
                if (isMounted) addPeer(payload.signal, payload.from);
            });
        })
        return () => { isMounted = false };
    }, [])

    const answer= () => {
        console.log("answer");
        client.on("receiving returned signal", payload => {
            const item = peersRef.current.find(p => p.peerID == payload.from);    
            item.peer.signal(payload.signal);
        });
        client.on("all users", users => {
            users.map(userID => {
                createPeer(userID);
            })
        })
        client.emit("answerCall", {to: myStoreStream.callerId})
        dispatch(streamActions.update({name:"calling",value:false}))
    }

    const createPeer = (to)=> {
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            const item = peersRef.current.find(p => p.peerID == to);  
            console.log(peersRef.current);  
            if(item) return;
            const peer = new Peer({
                initiator: true,
                trickle: false,
                stream,
            });
            
        peer.on("signal", signal => {
            console.log("girdi");
            client.emit("sending signal", { signal, to });    
        })
        peersRef.current.push({ peerID: to, peer: peer });
        setPeers(users => [...users, peer]);

    })
    }

    const addPeer = (incomingSignal, to) => {
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            const item = peersRef.current.find(p => p.peerID == to);  
            console.log(peersRef.current,to);  
     
            if(item) return;

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            client.emit("returning signal", { signal, to })
        })

        peer.signal(incomingSignal);
        peersRef.current.push({ peerID: to, peer: peer });
        setPeers(users => [...users, peer]);
    })
    }

    return (
        <div style={{height:"500p",overflowY:"scroll"}}>
            {myStoreStream.calling && <Button onClick={()=>{answer()}}>Answer</Button>}
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
        </div>
    );
};

export default Room;