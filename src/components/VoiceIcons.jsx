import React from "react";

// Discord's microphone and headphones icons. The "off" variants carry a strike,
// red in the user panel and grey in the voice channel list.
const STRIKE =
  "M21 4.27L19.73 3L3 19.73L4.27 21L8.46 16.82L9.69 15.58L11.35 13.92L14.99 10.28L21 4.27Z";
const RED = "#ed4245";

export const MicrophoneIcon = ({ muted, size = 20, strike = RED }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24">
    {muted ? (
      <>
        <path
          fill="currentColor"
          d="M6.7 11H5C5 12.19 5.34 13.3 5.9 14.28L7.13 13.05C6.86 12.43 6.7 11.74 6.7 11Z"
        />
        <path
          fill="currentColor"
          d="M9.01 11.085C9.015 11.1125 9.02 11.14 9.02 11.17L15 5.18V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 11.03 9.005 11.0575 9.01 11.085Z"
        />
        <path
          fill="currentColor"
          d="M11.7237 16.0927L10.9632 16.8531L10.2533 17.5688C10.4978 17.633 10.747 17.6839 11 17.72V22H13V17.72C16.28 17.23 19 14.41 19 11H17.3C17.3 14 14.76 16.1 12 16.1C11.9076 16.1 11.8155 16.0975 11.7237 16.0927Z"
        />
        <path fill={strike} d={STRIKE} />
      </>
    ) : (
      <path
        fill="currentColor"
        d="M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V21H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1Z"
      />
    )}
  </svg>
);

export const HeadphonesIcon = ({ deafened, size = 20, strike = RED }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12 2.00305C6.486 2.00305 2 6.48805 2 12.0031V20.0031C2 21.1071 2.895 22.0031 4 22.0031H6C7.104 22.0031 8 21.1071 8 20.0031V17.0031C8 15.8991 7.104 15.0031 6 15.0031H4V12.0031C4 7.59105 7.589 4.00305 12 4.00305C16.411 4.00305 20 7.59105 20 12.0031V15.0031H18C16.896 15.0031 16 15.8991 16 17.0031V20.0031C16 21.1071 16.896 22.0031 18 22.0031H20C21.104 22.0031 22 21.1071 22 20.0031V12.0031C22 6.48805 17.514 2.00305 12 2.00305Z"
    />
    {deafened && <path fill={strike} d={STRIKE} />}
  </svg>
);

// ---- icons of the voice connection panel and the user panel

const Icon = ({ size = 20, children, viewBox = "0 0 24 24" }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox={viewBox}>
    {children}
  </svg>
);

// "Voice Connected": a connection signal fanning out from the corner
export const SignalIcon = ({ size = 20 }) => (
  <Icon size={size}>
    <circle cx="5.5" cy="18.5" r="2.25" fill="currentColor" />
    <path d="M4 11.75a8.25 8.25 0 0 1 8.25 8.25" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M4 5a15 15 0 0 1 15 15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </Icon>
);

// Noise suppression: a sound wave; struck through while it is off
export const NoiseSuppressionIcon = ({ off, size = 20 }) => (
  <Icon size={size}>
    <rect x="2.5" y="9" width="2.5" height="6" rx="1.25" fill="currentColor" />
    <rect x="7" y="5" width="2.5" height="14" rx="1.25" fill="currentColor" />
    <rect x="11.5" y="8" width="2.5" height="8" rx="1.25" fill="currentColor" />
    <rect x="16" y="3" width="2.5" height="18" rx="1.25" fill="currentColor" />
    <rect x="20.5" y="9.5" width="2.5" height="5" rx="1.25" fill="currentColor" />
    {off && <path fill="#ed4245" d={STRIKE} />}
  </Icon>
);

export const DisconnectIcon = ({ size = 20 }) => (
  <Icon size={size}>
    <path
      fill="currentColor"
      d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"
    />
  </Icon>
);

export const CameraOffIcon = ({ size = 20 }) => (
  <Icon size={size}>
    <path
      fill="currentColor"
      d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"
    />
  </Icon>
);

export const CameraIcon = ({ size = 20 }) => (
  <Icon size={size}>
    <path
      fill="currentColor"
      d="M21.526 8.149C21.231 7.966 20.862 7.951 20.553 8.105L18 9.382V7C18 5.897 17.103 5 16 5H4C2.897 5 2 5.897 2 7V17C2 18.104 2.897 19 4 19H16C17.103 19 18 18.104 18 17V14.618L20.553 15.894C20.694 15.965 20.847 16 21 16C21.183 16 21.365 15.949 21.526 15.851C21.82 15.668 22 15.347 22 15V9C22 8.653 21.82 8.332 21.526 8.149Z"
    />
  </Icon>
);

export const ScreenShareIcon = ({ size = 20 }) => (
  <Icon size={size}>
    <path
      fill="currentColor"
      d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.11-.9-2-2-2H4c-1.11 0-2 .89-2 2v10c0 1.1.89 2 2 2H0v2h24v-2h-4zm-7-3.53v-2.19c-2.78 0-4.61.85-6 2.72.56-2.67 2.11-5.33 6-5.87V7l4 3.73-4 3.74z"
    />
  </Icon>
);

export const ActivitiesIcon = ({ size = 20 }) => (
  <Icon size={size}>
    <circle cx="7" cy="7" r="4" fill="currentColor" />
    <path fill="currentColor" d="M17 2.5l4.5 8h-9z" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" fill="currentColor" />
    <path fill="currentColor" d="M15.75 13h2.5v3.75H22v2.5h-3.75V23h-2.5v-3.75H12v-2.5h3.75z" />
  </Icon>
);

export const SoundboardIcon = ({ size = 20 }) => (
  <Icon size={size}>
    <path
      fill="currentColor"
      d="M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z"
    />
  </Icon>
);

export const ChevronIcon = ({ size = 12 }) => (
  <Icon size={size}>
    <path
      fill="currentColor"
      d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"
    />
  </Icon>
);

export const SettingsIcon = ({ size = 20 }) => (
  <Icon size={size}>
    <path
      fill="currentColor"
      d="M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
    />
  </Icon>
);

// The small speaker next to "In voice"
export const InVoiceIcon = ({ size = 12 }) => (
  <Icon size={size}>
    <path
      fill="currentColor"
      d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
    />
  </Icon>
);
