import { useEffect, useRef, useState } from "react";
import Peer from 'peerjs';
import { Button, Form } from "react-bootstrap";


const VideoChat = () => {
    // video chat webRTC
    const [video, setVideo] = useState(false);
    const [conn,setConn] = useState(null);
    const [audio, setAudio] = useState(false);
    const [stream, setStream] = useState(null);
    const [peer, setPeer] = useState(null);
    const [peerId,setPeerId]=useState(null);
    const [call, setCall] = useState(null);
    const [caller, setCaller] = useState(null);
    const [callerName, setCallerName] = useState(null);
    const [callerId, setCallerId] = useState(null);
    const [callerStream, setCallerStream] = useState(null);
    const [callerVideo, setCallerVideo] = useState(null);
    const [callerAudio, setCallerAudio] = useState(null);
    const [callerVideoTrack, setCallerVideoTrack] = useState(null);
    const [callerAudioTrack, setCallerAudioTrack] = useState(null);
    const [formText, setFormText] = useState("");
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if(peerId || peer) return
        const rawPeer = new Peer(null, {
            debug: 2
        });
        rawPeer.on('open', (id) =>{
            console.log("ID: ",id)
            setPeerId(id);
        });
        rawPeer.on('connection', (c) => {
            console.log("listen to: " + c.peer);
            if (c && c.open) {
                c.on('open', () => {
                    c.send("Already connected to another client");
                    setTimeout(()=> { c.close(); }, 500);
                });
                return;
            }

            ready();
            setConn(c);
        });
        rawPeer.on('disconnected', () => {
            console.log('Connection lost. Please reconnect');

        });
        rawPeer.on('close', () => {
            console.log('Connection destroyed');
        });
        rawPeer.on('error', (err) =>{
            console.log(err);
            setPeer(null);
        });
        rawPeer.on('call', async (call) => {
            console.log(call)
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            call.answer(stream)
              call.on('stream', (remoteStream) => {
                    console.log("remoteStream: ",remoteStream);
                setStream(remoteStream);
              });
          });
        setPeer(rawPeer);
    }, []);

    const ready = () => {
        if(!conn) return
        conn.on('data', (data) => {
            console.log("Data recieved");
            switch (data) {
                case 'Go':
                    break;
                case 'Fade':
                    break;
                case 'Off':
                    break;
                case 'Reset':
                    break;
                default:
                    break;
            };
        });
        conn.on('close', function () {
            console.log("Connection closed");
            // setConn(null);
        });
    }

    const Join = () => {
        const rawConn= peer.connect(formText, {
            reliable: true
        })
        rawConn.on('open', async ()=> {
            console.log("Connected to: " + rawConn.peer);

            // Check URL params for comamnds that should be sent immediately
            var command = getUrlParam("command");
            if (command)
            rawConn.send(command);
            const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
            const call = peer.call(formText, stream);
            call.on('stream', (remoteStream) => {
                setStream(remoteStream);
                
            });
        });
        // Handle incoming data (messages only since this is the signal sender)
        rawConn.on('data', (data) => {
        });
        rawConn.on('close', () =>{
        });
        setConn(rawConn);
    }

    const getUrlParam =(name)=> {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null)
            return null;
        else
            return results[1];
    };
    const handleChange = (e) => {
        setFormText(e.target.value); // set name to e.target.value (event)
      };
    return (
        <>
        <div>
            {`ID: ${peerId}`}
            <input value={formText} onChange = {handleChange}/>
            <Button onClick={()=>{Join()}}>
                {conn ? "Stop" : "Start"} Video Chat
            </Button>
            {true && (
                <div>
                    <Button onClick={()=>{}}>
                        {video ? "Stop" : "Start"} Video
                    </Button>
                    <Button onClick={()=>{}}>
                        {audio ? "Stop" : "Start"} Audio
                    </Button>
                    <Button onClick={()=>{}}>Start Video Chat</Button>
                    {stream && (
                        <div style={{ width: "50vw" ,height: "50vh",backgroundColor: "black"}}>
                            <video
                                style={{ width: "50vw" ,height: "50vh"}}
                                autoPlay
                                playsInline
                                ref={(video) => {
                                    if (video) {
                                        video.srcObject = stream;
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
        </>)
}
export default VideoChat