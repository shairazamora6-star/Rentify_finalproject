export default function RentifyLogo({ size = 36, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="32" y="32" width="448" height="448" rx="112" fill="#3978D5" />
      <circle cx="188" cy="314" r="78" stroke="white" strokeWidth="52" />
      <path d="M244 258L376 126" stroke="white" strokeWidth="52" strokeLinecap="round" />
      <path
        d="M334 180L358 156C374 140 400 140 416 156L438 178C454 194 454 220 438 236L408 266C392 282 366 282 350 266L320 236C304 220 304 198 318 184Z"
        fill="white"
      />
      <rect x="370" y="202" width="34" height="34" rx="5" transform="rotate(-45 370 202)" fill="#3978D5" />
    </svg>
  )
}
