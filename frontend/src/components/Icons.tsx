import React from 'react';
import { View, Image } from 'react-native';

type IconProps = {
  size?: number;
  color?: string;
  active?: boolean;
};

export function IconHome({ size = 24, color = '#25352F', active = false }: IconProps) {
  const c = active ? '#F97316' : color;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? '#FFF8EF' : 'none'}>
      <path
        d="M9.02 2.84L3.63 7.04C2.73 7.74 2 9.23 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29 21.19 7.74 20.2 7.05L14.02 2.72C12.62 1.74 10.37 1.79 9.02 2.84Z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 17.99V14.99" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconHeart({ size = 24, active = false }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? '#F97316' : 'none'}>
      <path
        d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z"
        stroke={active ? '#F97316' : '#25352F'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconLike({ size = 24, active = false }: IconProps) {
  const c = active ? '#F97316' : '#25352F';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={active ? '#FFF8EF' : 'none'}>
      <path
        d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconTicket({ size = 24, active = false }: IconProps) {
  const c = active ? '#F97316' : '#25352F';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M19.5 12.5C19.5 11.12 20.62 10 22 10V9C22 5 21 4 17 4H7C3 4 2 5 2 9V9.5C3.38 9.5 4.5 10.62 4.5 12C4.5 13.38 3.38 14.5 2 14.5V15C2 19 3 20 7 20H17C21 20 22 19 22 15C20.62 15 19.5 13.88 19.5 12.5Z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 4V20" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" />
    </svg>
  );
}

export function IconMessage({ size = 24, color = '#25352F', active = false }: IconProps) {
  const c = active ? '#F97316' : color;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7 8H17M7 13H13" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconProfile({ size = 24, active = false }: IconProps) {
  const c = active ? '#F97316' : '#25352F';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4.5" stroke={c} strokeWidth="1.8" />
      <path
        d="M4 20.5C4 16.91 7.58 14 12 14C16.42 14 20 16.91 20 20.5"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconBell({ size = 24, color = '#25352F', hasBadge = false }: IconProps & { hasBadge?: boolean }) {
  return (
    <View style={{ position: 'relative' }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12.02 2.91C8.71 2.91 6.02 5.6 6.02 8.91V11.8C6.02 12.41 5.76 13.34 5.45 13.86L4.3 15.77C3.59 16.95 4.08 18.26 5.38 18.7C9.69 20.14 14.34 20.14 18.65 18.7C19.86 18.3 20.39 16.87 19.73 15.77L18.58 13.86C18.28 13.34 18.02 12.41 18.02 11.8V8.91C18.02 5.61 15.32 2.91 12.02 2.91Z"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M15.02 19.06C15.02 20.71 13.67 22.06 12.02 22.06C11.2 22.06 10.44 21.72 9.9 21.18C9.36 20.64 9.02 19.88 9.02 19.06"
          stroke={color}
          strokeWidth="1.8"
        />
      </svg>
      {hasBadge && (
        <View
          style={{
            position: 'absolute',
            top: 1,
            right: 2,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#F97316',
          }}
        />
      )}
    </View>
  );
}

export function IconSearch({ size = 20, color = '#737373' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11.5" cy="11.5" r="8.5" stroke={color} strokeWidth="1.8" />
      <path d="M18.5 18.5L22 22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconFunnel({ size = 22, color = '#25352F' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCalendar({ size = 16, color = '#46564F' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="4" stroke={color} strokeWidth="1.8" />
      <path d="M8 2V6M16 2V6M3 9.5H21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconLocation({ size = 16, color = '#82918A' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 13.43C13.72 13.43 15.12 12.03 15.12 10.31C15.12 8.59 13.72 7.19 12 7.19C10.28 7.19 8.88 8.59 8.88 10.31C8.88 12.03 10.28 13.43 12 13.43Z"
        stroke={color}
        strokeWidth="1.8"
      />
      <path
        d="M3.62 8.49C5.59 -0.17 18.42 -0.16 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z"
        stroke={color}
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function IconUsers({ size = 16, color = '#82918A' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="4" stroke={color} strokeWidth="1.8" />
      <path d="M2 20C2 16.69 5.13 14 9 14C12.87 14 16 16.69 16 20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 3.13C17.76 3.58 19 5.14 19 7C19 8.86 17.76 10.42 16 10.87" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 20C22 17.34 20.11 15.08 17.5 14.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconClock({ size = 16, color = '#F97316' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="1.8" />
      <path d="M12 7V12L15.5 14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconArrowLeft({ size = 24, color = '#25352F' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" />
      <path d="M13.5 8.5L10 12L13.5 15.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCloseCircle({ size = 32, color = '#25352F' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.6" />
      <path d="M9.17 14.83L14.83 9.17M14.83 14.83L9.17 9.17" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconSetting({ size = 24, color = '#25352F' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke={color}
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function IconPlus({ size = 24, color = '#25352F' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconEdit({ size = 20, color = '#25352F' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.04 3.02L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96C22.34 6.6 22.98 5.02 20.98 3.02C18.98 1.02 17.4 1.66 16.04 3.02Z"
        stroke={color}
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function IconScan({ size = 20, color = '#FFFFFF' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M2 9V6.5C2 4.01 4.01 2 6.5 2H9M15 2H17.5C19.99 2 22 4.01 22 6.5V9M22 16V17.5C22 19.99 19.99 22 17.5 22H16M9 22H6.5C4.01 22 2 19.99 2 17.5V15M5 12H19"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconDocument({ size = 24, color = '#25352F', active = false }: IconProps) {
  const c = active ? '#F97316' : color;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H14"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 10H18C15 10 14 9 14 6V2L22 10Z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7 13H13M7 17H11" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck({ size = 20, color = '#27845D' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronRight({ size = 20, color = '#25352F' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLogout({ size = 20, color = '#D94B45' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M8.9 7.56C9.21 3.96 11.06 2.49 15.11 2.49H15.24C19.71 2.49 21.5 4.28 21.5 8.75V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24 20.08 8.91 16.54M15 12H3.62M5.85 8.65L2.5 12L5.85 15.35"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMap({ size = 20, color = '#F97316' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M2.29 7.78V17.51C2.29 19.41 3.64 20.19 5.28 19.25L7.63 17.91C8.14 17.62 8.99 17.59 9.52 17.86L14.77 20.49C15.3 20.75 16.15 20.73 16.66 20.44L20.99 17.96C21.54 17.64 22 16.86 22 16.22V6.49C22 4.59 20.65 3.81 19.01 4.75L16.66 6.09C16.15 6.38 15.3 6.41 14.77 6.14L9.52 3.52C8.99 3.26 8.14 3.28 7.63 3.57L3.3 6.05C2.74 6.37 2.29 7.15 2.29 7.78Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.56 4V17M15.73 6.62V20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
