import { useEffect, useRef } from 'react';
import spw from 'simple-peer-wrapper'

const ChatVideo2 = (props) => {
    const myRef=useRef()
    useEffect(() => {
 
          spw.on('data', (data) => {
            const partnerData = data.data;
          });
          // make sure you close the connection before you close the window
          window.onbeforeunload = () => {
            spw.close();
          };
          spw.on('stream', (stream) => {
            myRef=stream
          });
    }, [])
    return (
        <>
            <video ref={myRef}></video>
        </>
    );
}
export default ChatVideo2;