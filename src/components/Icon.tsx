/**
 * Conjunto de ícones em traço, desenhados para o tema do sistema.
 * Herdam a cor do texto (currentColor) — nada de emoji do sistema operacional.
 */
const PATHS = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  star: <path d="m12 3.2 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.6l6-.9z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 1.9" />
    </>
  ),
  phone: (
    <path d="M5 3h3l2 5-2.5 1.6a12.4 12.4 0 0 0 5.9 5.9L15 13l5 2v3a2 2 0 0 1-2.2 2A16.2 16.2 0 0 1 3 5.2 2 2 0 0 1 5 3z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M16.8 7.2h.01" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5.6-8 12-8 12s-8-6.4-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  flame: (
    <path d="M12 3c3 3.6 5 6.1 5 9a5 5 0 0 1-10 0c0-1.6.5-2.9 1.6-4 .2 1 .8 1.8 1.6 2.2C10.1 8.1 10.7 5.7 12 3z" />
  ),
  x: <path d="M18 6 6 18M6 6l12 12" />,
  plus: <path d="M12 5v14M5 12h14" />,
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.4 12.2 2.5 2.5 4.7-5.2" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>
  ),
  burger: (
    <>
      <path d="M4 9.5a8 4.5 0 0 1 16 0z" />
      <path d="M3.6 12.4h16.8" />
      <path d="M4 15.2a8 4.5 0 0 0 16 0z" />
    </>
  ),
  folder: (
    <path d="M3 7a2 2 0 0 1 2-2h3.6a2 2 0 0 1 1.5.7L11.6 7H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  ),
  qr: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <path d="M14 14h3.2v3.2H14zM20.4 14H21M14 20.4V21M17.6 20.6H21V17.4" />
    </>
  ),
  settings: (
    <>
      <path d="M4 6h9M19 6h1M4 12h4M14 12h6M4 18h9M19 18h1" />
      <circle cx="16" cy="6" r="2.2" />
      <circle cx="11" cy="12" r="2.2" />
      <circle cx="16" cy="18" r="2.2" />
    </>
  ),
  pencil: <path d="m4 20 1.2-4.2L16.4 4.6a2.2 2.2 0 0 1 3 3L8.2 18.8z" />,
  eye: (
    <>
      <path d="M2.5 12S6 6.2 12 6.2 21.5 12 21.5 12 18 17.8 12 17.8 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M4 4 20 20" />
      <path d="M9.9 5.4A10 10 0 0 1 12 6.2c6 0 9.5 5.8 9.5 5.8a17 17 0 0 1-3.3 3.7" />
      <path d="M6.4 7.8A16.6 16.6 0 0 0 2.5 12S6 17.8 12 17.8c1.4 0 2.7-.3 3.8-.8" />
      <path d="M9.9 10.1a3 3 0 0 0 4.1 4.1" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7" />
      <path d="m6.5 7 .9 12a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9l.9-12" />
    </>
  ),
  arrowUp: <path d="M12 20V4.5M6.2 10.3 12 4.5l5.8 5.8" />,
  arrowDown: <path d="M12 4v15.5M6.2 13.7 12 19.5l5.8-5.8" />,
  printer: (
    <>
      <path d="M7 8.5V3.5h10v5" />
      <rect x="3" y="8.5" width="18" height="8" rx="2" />
      <path d="M7 13.5h10v7H7z" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5v11.8M7 11l5 5 5-5" />
      <path d="M4.5 20.5h15" />
    </>
  ),
  link: (
    <>
      <path d="M10.2 13.4a4.2 4.2 0 0 0 6 0l2.4-2.4a4.2 4.2 0 0 0-6-6L11.4 6.2" />
      <path d="M13.8 10.6a4.2 4.2 0 0 0-6 0l-2.4 2.4a4.2 4.2 0 0 0 6 6l1.2-1.2" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3.2L8.8 5.8h6.4L16.8 8H20a1.2 1.2 0 0 1 1.2 1.2v8.6A1.2 1.2 0 0 1 20 19H4a1.2 1.2 0 0 1-1.2-1.2V9.2A1.2 1.2 0 0 1 4 8z" />
      <circle cx="12" cy="13.2" r="3.4" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.6" cy="9.8" r="1.6" />
      <path d="m4.8 18 4.8-4.8 3 3 2.4-2.4 4.2 4.2" />
    </>
  ),
  chat: <path d="M20.5 14.6a2.4 2.4 0 0 1-2.4 2.4H8.4L4 20.2V5.9a2.4 2.4 0 0 1 2.4-2.4h11.7a2.4 2.4 0 0 1 2.4 2.4z" />,
  trophy: (
    <>
      <path d="M8 3.5h8v5.2a4 4 0 0 1-8 0z" />
      <path d="M8 5H5.2v1.8A3.2 3.2 0 0 0 8.4 10M16 5h2.8v1.8A3.2 3.2 0 0 1 15.6 10" />
      <path d="M12 12.8v3.9M9 20.5h6" />
    </>
  ),
  external: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11.5 12.5" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </>
  ),
} as const;

export type IconName = keyof typeof PATHS;

type Props = {
  name: IconName;
  className?: string;
  /** Preenche a forma em vez de desenhar só o contorno (usado na estrela da nota). */
  filled?: boolean;
  strokeWidth?: number;
};

export function Icon({ name, className = "h-4 w-4", filled, strokeWidth = 1.8 }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}
