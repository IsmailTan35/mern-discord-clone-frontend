import { useContext, useEffect, useRef, useState, useLayoutEffect } from "react";
import Peer from "simple-peer";
import { SocketContext } from "controller/Context";
import { useDispatch, useSelector } from "react-redux";
import { streamActions } from 'store';
import hark from 'hark'
import {ReactComponent as CameraIcon } from 'assets/img/stream/stream-1.svg';
import {ReactComponent as ScreenShareIcon } from 'assets/img/stream/stream-2.svg';
import {ReactComponent as MicrophoneIcon } from 'assets/img/stream/stream-3.svg';
import {ReactComponent as HangupIcon } from 'assets/img/stream/stream-4.svg';

import "assets/css/stream.css";

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const streamStartEvent = new Event("streamStart");
const streamEndEvent = new Event("streamEnd");
const Video = ({peer,mute}) => {
    const ref = useRef();
    const [speaking, setSpeaking] = useState(false);
    useEffect(() => {
        peer.on("stream", stream => {
            ref.current.srcObject = stream;

            var speechEvents = hark(stream,{})
            speechEvents.on('speaking', () => {
                setSpeaking(true)
            })

            speechEvents.on('stopped_speaking', () => {
                setSpeaking(false)
            })
        })
        peer.on("data", stream => {
            console.log(stream)
            ref.current.srcObject = new HTMLMediaElement(stream);
            var speechEvents = hark(stream,{})
            speechEvents.on('speaking', () => {
                setSpeaking(true)
            })

            speechEvents.on('stopped_speaking', () => {
                setSpeaking(false)
            })
            })
    }, []);

    return (
        <video
            muted={mute}
            playsInline 
            autoPlay 
            ref={ref} 
            className={`stream-webRTC${speaking ? " active" : ""}`}
            style={{...videoConstraints}}
            controls={false}
            />
    );
}


const Room = () => {
    const dispatch = useDispatch()
    const socket = useContext(SocketContext);
    const [peers, setPeers] = useState([]);
    const [mute, setMute] = useState(false);
    const [headphone, setHeadphone] = useState(false);
    const myStoreStream = useSelector(state => state.stream.items);


    const removePeer = (id) => {
        setPeers(item =>item.map(p => {
            if(p.peerID == id){
                p.peer.destroy();
            }
            return p
        }).filter(p => p.peerID != id));
    }

    useEffect(() => {
        if(peers.length==0) window.dispatchEvent(streamEndEvent);
        else if(peers.length>0) window.dispatchEvent(streamStartEvent);
    },[peers])
    useEffect(() => {
        let isMounted = true;

        socket.on("acceptedCall", data => {

        })
        socket.on("user joined", payload => {
             if(isMounted) addPeer(payload.signal, payload.from);
        });
        socket.on("all users", users => {
            users.map(userID => {
                if(isMounted) createPeer(userID);
            })
        })
        socket.on("hangup", payload => {
            if(isMounted) removePeer(payload.from);
        })

        socket.on("receiving returned signal", payload => {
            setPeers(items => items.map(item => {
                if(item.peerID == payload.from){
                    item.peer.signal(payload.signal);
                }
                return item
            }))
        });

        socket.on("hangup", payload => {
            if(isMounted) removePeer(payload.from);
        })

        return () => {
            isMounted = false
        }
    }, [])

    const answer = () => {
        socket.emit("answerCall", {receiver: myStoreStream.callerId})
        dispatch(streamActions.update({name:"calling",value:false}))
    }

    const createPeer = (receiver)=> {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => {
                // window.localStream = stream;
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
                setPeers(users => [...users, { peerID: receiver, peer: peer ,stream:stream}]);
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
                stream.getTracks().map(track => track.stop())
            })
            
            setPeers(users => [...users, { peerID: receiver, peer: peer ,stream:stream}]);

        })
    }

    const handleHangup = () => {
        socket.emit("hangupCall")
        peers.map(item => {
            if(!item.peer || !item.peer.streams || item.peer.streams.length <= 0) return
            item.peer.destroy()
            item.peer.streams[0].getTracks().forEach(track => track.stop())
        })
        // window.localStream.getTracks().forEach(track => track.stop())
        setPeers([]);
    }
    
    const handleMute = () => {
        setMute(prv=> !prv)
    }

    const handleDisableMicrophone = () => {
        peers.map(item => {
            if(!item.peer || !item.peer.streams || item.peer.streams.length <= 0) return
            item.peer.streams[0].getTracks().forEach(track => {
                if(track.kind === "audio") {
                    track.enabled = !track.enabled
                }
            }
            )
        }
        )
    }

    const handleDisableCamera = () => {
        peers.map(item => {
            if(!item.peer || !item.peer.streams || item.peer.streams.length <= 0) return
            item.peer.streams[0].getTracks().forEach(track => {
                if(track.kind === "video") {
                    track.enabled = !track.enabled
                }
            }
            )
        }
        )
    }

    const handleShareScreen = () => {
        navigator.mediaDevices.getDisplayMedia({video: {cursor:true}, audio: true})
        .then(stream => {
            let screenStream = stream;
            let videoTrack = screenStream.getVideoTracks()[0];
            videoTrack.onended = () => {
                console.log("first")
            }
            setPeers(items=>{
                items.map(item => {
                item.peer.replaceTrack(item.stream.getVideoTracks()[0], stream.getVideoTracks()[0], item.stream)
                }
            )
        })

        })
    }
    return (
        <div className="stream-wrapper" style={{display: peers.length>0?"flex":"none"}} id="deneme">
            <div className="stream">
                {peers.filter(item=> item.peerID != socket.id).map((item, index) => {
                    return (
                        <Video key={index} peer={item.peer} mute={mute}/>
                        );
                    })}
            </div>
            { peers.length>0?<>
                <div className="stream-buttons-wrapper">
                    <div>
                        <div></div>
                    </div>
                    <div className="stream-buttons">
                        <div className="stream-button-camera" onClick={handleDisableCamera}>
                            <CameraIcon />
                        </div>
                        <div className="stream-button-screen-share" onClick={handleShareScreen}>
                            <ScreenShareIcon />
                        </div>
                        <div className="stream-button-microphone" 
                            onClick={handleDisableMicrophone}>
                            <MicrophoneIcon />
                        </div>
                        <div className="stream-button-hangup"
                            onClick={handleHangup}>
                            <HangupIcon />
                        </div>
                    </div>
                    <div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </>:
            null}

        </div>
    );
};

export default Room;