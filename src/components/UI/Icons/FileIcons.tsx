type Props = React.SVGProps<SVGSVGElement> & { size?: number };

export const File = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path d="M152 32H72a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16V96Z" />
    <path
      d="M152 32v64h64"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
    />
  </svg>
);

export const FileText = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path d="M152 32H72a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16V96Z" />
    <path
      d="M152 32v64h64M96 144h64M96 176h64"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
    />
  </svg>
);

export const MonitorPlay = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <rect
      x="32"
      y="48"
      width="192"
      height="128"
      rx="8"
      ry="8"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
    />
    <path d="M116 96l40 32-40 32Z" />
  </svg>
);

export const Question = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path
      d="M96 104a32 32 0 1 1 48 28v16"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
    />
    <circle cx="128" cy="184" r="8" />
  </svg>
);

export const PlayCircle = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <circle
      cx="128"
      cy="128"
      r="96"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
    />
    <path d="M112 96l48 32-48 32Z" />
  </svg>
);

export const QuestionMark = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path
      d="M128 176v-16a32 32 0 1 0-32-32"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
    />
    <circle cx="128" cy="200" r="8" />
  </svg>
);
