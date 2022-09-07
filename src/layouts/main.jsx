import { useRef } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useEffectAsync } from "reactHelper";

const Main = () => {
  const [microphone, setMicrophone] = useState(false);
  const analyserCanvas = useRef(null);

  useEffectAsync(async () => {
    if (microphone) {
      if (navigator.mediaDevices.getUserMedia !== null) {
        const options = {
          video: false,
          audio: true,
        };
        try {
          const stream = await navigator.mediaDevices.getUserMedia(options);
          const audioCtx = new AudioContext();
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 2048;
          const audioSrc = audioCtx.createMediaStreamSource(stream);
          audioSrc.connect(analyser);
          const data = new Uint8Array(analyser.frequencyBinCount);

          const ctx = analyserCanvas.current.getContext("2d");
          const draw = dataParm => {
            dataParm = [...dataParm];
            ctx.fillStyle = "white"; //white background
            ctx.lineWidth = 2; //width of candle/bar
            ctx.strokeStyle = "#d5d4d5"; //color of candle/bar
            const space = analyserCanvas.current.width / dataParm.length;
            dataParm.forEach((value, i) => {
              ctx.beginPath();
              ctx.moveTo(space * i, analyserCanvas.current.height);
              ctx.lineTo(space * i, analyserCanvas.current.height - value);
              ctx.stroke();
            });
            setTimeout(() => {
              ctx.clearRect(
                0,
                0,
                analyserCanvas.current.width,
                analyserCanvas.current.height
              );
            }, 100);
          };
          const loopingFunction = () => {
            requestAnimationFrame(loopingFunction);
            analyser.getByteFrequencyData(data);
            draw(data);
          };
          requestAnimationFrame(loopingFunction);
        } catch (err) {}
      }
    }
  }, [microphone]);

  return (
    <div>
      <Button onClick={() => setMicrophone(!microphone)}>
        {" "}
        {microphone ? "Stop" : "Start"}{" "}
      </Button>
      <canvas width="300" height="300" ref={analyserCanvas} />;
    </div>
  );
};
export default Main;
