import React, { useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { SocketContext } from "controller/Context";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { friendsActions, streamActions } from 'store';

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
    const storeStream = useSelector(state => state.stream);
    const [peers, setPeers] = useState([]);
    const client = useContext(SocketContext);
    const userVideo = useRef();
    const peersRef = useRef([]);
    const dispatch = useDispatch()

    useEffect(() => {
        client.on("acceptedCall", payload => {
            navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
                const peer = createPeer(payload.from, client.id, stream);
                peersRef.current.push({
                        peerID: payload.from,
                        peer,
                    })
                setPeers(users => [...users, peer]);

                // client.on("user joined", payload => {
                //     const peer = addPeer(payload.signal, payload.callerID, stream);
                //     peersRef.current.push({
                //         peerID: payload.callerID,
                //         peer,
                //     })
                //     setPeers(users => [...users, peer]);
                // });

            });
        })
        
        client.on("receiving returned signal", payload => {
            const item = peersRef.current.find(p => p.peerID === payload.id);
            item.peer.signal(payload.signal);
        });
    } , [])

    const answer=() => {
        dispatch(streamActions.update({name:"calling",value:false}))
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            client.emit("answerCall", { from: storeStream.callerId })
            client.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, client.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            client.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })
                setPeers(users => [...users, peer]);
            });

            client.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            client.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            client.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <div style={{height:"500p",overflowY:"scroll"}}>
            {storeStream.calling && <Button onClick={()=>{answer()}}>Answer</Button>}
            {/* <video muted ref={userVideo} autoPlay playsInline /> */}
            {peers.map((peer, index) => {
                return (
                    <Video key={index} peer={peer} />
                );
            })}
        </div>
    );
};

export default Room;