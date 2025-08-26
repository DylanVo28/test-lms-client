type Props = React.SVGProps<SVGSVGElement> & { size?: number };

export const Eye = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path
      d="M16 128s40-64 112-64 112 64 112 64-40 64-112 64-112-64-112-64Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
    />
    <circle cx="128" cy="128" r="32" />
  </svg>
);

export const EyeSlash = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path
      d="M16 128s40-64 112-64 112 64 112 64-40 64-112 64-112-64-112-64Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
    />
    <path d="M48 48l160 160" stroke="currentColor" strokeWidth="12" />
  </svg>
);
