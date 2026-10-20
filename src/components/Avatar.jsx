import { useState } from 'react';
import { useSelector } from 'react-redux';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import AvatarPicture from './AvatarPicture';
import DeviceMenu from './DeviceMenu';
import {
    ChevronIcon,
    HeadphonesIcon,
    InVoiceIcon,
    MicrophoneIcon,
    SettingsIcon,
} from './VoiceIcons';
import {
    toggleSelfDeaf,
    toggleSelfMute,
    useVoiceSettings,
} from 'common/voiceSettings';
import { useVoiceState } from 'controller/voiceChannel';
import { openSettings } from 'common/settingsEvents';

import 'assets/css/userpanel.css';

const delay = { show: 50, hide: 0 };

// `hideTooltip`: no tooltip while the button's own menu is open
const PanelButton = ({ label, active, onClick, children, id, className, hideTooltip }) => (
    <OverlayTrigger
        placement="top"
        delay={delay}
        overlay={props => (
            <Tooltip {...props} style={hideTooltip ? { ...props.style, display: 'none' } : props.style}>
                {label}
            </Tooltip>
        )}
    >
        <button
            type="button"
            id={id}
            aria-label={label}
            aria-pressed={active}
            className={className}
            onClick={onClick}
        >
            {children}
        </button>
    </OverlayTrigger>
);

// A button with the small arrow that opens its device menu, like Discord's
const ButtonWithMenu = ({ kind, danger, menuLabel, openMenu, setOpenMenu, children }) => (
    <div className={`user-panel-group${danger ? ' danger' : ''}${openMenu === kind ? ' open' : ''}`}>
        {children}
        <PanelButton
            label={menuLabel}
            className="user-panel-chevron"
            active={openMenu === kind}
            hideTooltip={openMenu === kind}
            onClick={() => setOpenMenu(current => (current === kind ? null : kind))}
        >
            <ChevronIcon />
        </PanelButton>
        {openMenu === kind && <DeviceMenu kind={kind} onClose={() => setOpenMenu(null)} />}
    </div>
);

// The user panel at the bottom of the sidebar
const Avatar = () => {
    const name = useSelector(state => state.user.name);
    const code = useSelector(state => state.user.code);
    const { selfMute, selfDeaf } = useVoiceSettings();
    const { channel } = useVoiceState();
    const servers = useSelector(state => state.server.items);
    const channels = useSelector(state => state.channels.items);
    const [openMenu, setOpenMenu] = useState(null);
    // Deafening also keeps the microphone off
    const muted = selfMute || selfDeaf;
    // Short like Discord's "In voice"; the full place is in the tooltip
    const voiceChannel = channel && channels.find(item => item._id === channel.channelID);
    const voiceServer = channel && servers.find(item => item._id === channel.serverID);
    const voicePlace = [voiceChannel && voiceChannel.channelname, voiceServer && voiceServer.servername]
        .filter(Boolean)
        .join(' / ');

    return (
        <div className="user-panel">
            <div className="user-panel-profile">
                <AvatarPicture state={true} />
                <div className="user-panel-names">
                    <div className="user-panel-name">{name}</div>
                    {channel ? (
                        <div
                            className="user-panel-status in-voice"
                            title={voicePlace ? `Ses kanalında: ${voicePlace}` : 'Ses kanalında'}
                        >
                            <InVoiceIcon />
                            <span>Seste</span>
                        </div>
                    ) : (
                        <div className="user-panel-status">{`#${code}`}</div>
                    )}
                </div>
            </div>
            <div className="user-panel-buttons">
                <ButtonWithMenu
                    kind="input"
                    danger={muted}
                    menuLabel="Giriş Seçenekleri"
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                >
                    <PanelButton
                        label={muted ? 'Susturmayı Kaldır' : 'Sustur'}
                        active={muted}
                        className="user-panel-main"
                        onClick={toggleSelfMute}
                    >
                        <MicrophoneIcon muted={muted} />
                    </PanelButton>
                </ButtonWithMenu>
                <ButtonWithMenu
                    kind="output"
                    danger={selfDeaf}
                    menuLabel="Çıkış Seçenekleri"
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                >
                    <PanelButton
                        label={selfDeaf ? 'Sağırlaştırmayı Kaldır' : 'Sağırlaştır'}
                        active={selfDeaf}
                        className="user-panel-main"
                        onClick={toggleSelfDeaf}
                    >
                        <HeadphonesIcon deafened={selfDeaf} />
                    </PanelButton>
                </ButtonWithMenu>
                <PanelButton
                    label="Kullanıcı Ayarları"
                    id="settings-button"
                    className="user-panel-settings"
                    onClick={() => openSettings()}
                >
                    <SettingsIcon />
                </PanelButton>
            </div>
        </div>
    );
};

export default Avatar;
