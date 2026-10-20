import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { SocketContext } from "controller/Context";
import {
  startScreenShare,
  stopScreenShare,
  stopVoiceChannel,
  useVoiceState,
} from "controller/voiceChannel";
import { updateVoiceSettings, useVoiceSettings } from "common/voiceSettings";
import {
  ActivitiesIcon,
  CameraOffIcon,
  DisconnectIcon,
  NoiseSuppressionIcon,
  ScreenShareIcon,
  SignalIcon,
  SoundboardIcon,
} from "components/VoiceIcons";

import "assets/css/userpanel.css";

const delay = { show: 50, hide: 0 };

const withTooltip = (label, element) => (
  <OverlayTrigger
    placement="top"
    delay={delay}
    overlay={props => <Tooltip {...props}>{label}</Tooltip>}
  >
    {element}
  </OverlayTrigger>
);

// Not available in this clone yet; shown like Discord but inactive
const SoonButton = ({ label, children }) =>
  withTooltip(
    `${label} (yakında)`,
    <button type="button" className="voice-panel-action disabled" aria-disabled="true" aria-label={label}>
      {children}
    </button>
  );

// The "Voice Connected" box above the user panel, like Discord's
const VoiceConnectedPanel = () => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const voice = useVoiceState();
  const { noiseSuppression } = useVoiceSettings();
  const servers = useSelector(state => state.server.items);
  const channels = useSelector(state => state.channels.items);

  if (!voice.channel) return null;
  const { serverID, channelID } = voice.channel;
  const server = servers.find(item => item._id === serverID);
  const channel = channels.find(item => item._id === channelID);

  const leave = () => {
    stopVoiceChannel();
    socket.emit("leaveAllChannels");
  };

  // Voice channels have no page of their own here: go to the server's text channel
  const openServer = () => {
    const textChannel = channels.find(
      item => item.serverID === serverID && item.type === "text"
    );
    if (textChannel) navigate(`/channels/${serverID}/${textChannel._id}`);
  };

  return (
    <div className="voice-panel">
      <div className="voice-panel-top">
        <div className="voice-panel-status">
          <div className="voice-panel-connected">
            <SignalIcon size={18} />
            <span>Ses Bağlantısı Kuruldu</span>
          </div>
          <button type="button" className="voice-panel-location" onClick={openServer}>
            {channel ? channel.channelname : "Ses kanalı"}
            {server ? ` / ${server.servername}` : ""}
          </button>
        </div>
        {withTooltip(
          noiseSuppression ? "Gürültü Azaltmayı Kapat" : "Gürültü Azaltmayı Aç",
          <button
            type="button"
            className="voice-panel-icon"
            aria-label="Gürültü Azaltma"
            aria-pressed={noiseSuppression}
            onClick={() => updateVoiceSettings({ noiseSuppression: !noiseSuppression })}
          >
            <NoiseSuppressionIcon off={!noiseSuppression} />
          </button>
        )}
        {withTooltip(
          "Bağlantıyı Kes",
          <button type="button" className="voice-panel-icon" aria-label="Bağlantıyı Kes" onClick={leave}>
            <DisconnectIcon />
          </button>
        )}
      </div>
      <div className="voice-panel-actions">
        <SoonButton label="Kamera">
          <CameraOffIcon />
        </SoonButton>
        {withTooltip(
          voice.sharing ? "Yayını Durdur" : "Ekranını Paylaş",
          <button
            type="button"
            className={`voice-panel-action${voice.sharing ? " active" : ""}`}
            aria-label={voice.sharing ? "Yayını Durdur" : "Ekranını Paylaş"}
            aria-pressed={voice.sharing}
            onClick={voice.sharing ? stopScreenShare : startScreenShare}
          >
            <ScreenShareIcon />
          </button>
        )}
        <SoonButton label="Etkinlikler">
          <ActivitiesIcon />
        </SoonButton>
        <SoonButton label="Ses Panosu">
          <SoundboardIcon />
        </SoonButton>
      </div>
    </div>
  );
};

export default VoiceConnectedPanel;
