type Props = React.SVGProps<SVGSVGElement> & { size?: number };

export const ThumbsUp = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path d="M232 80h-64l8-24a32 32 0 0 0-61.25-20.67L96 80H40a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h152a32 32 0 0 0 31.2-24.37l16-64A32 32 0 0 0 232 80Z" />
  </svg>
);

export const ThumbsDown = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path d="M24 176h64l-8 24a32 32 0 0 0 61.25 20.67L160 176h56a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16H64a32 32 0 0 0-31.2 24.37l-16 64A32 32 0 0 0 24 176Z" />
  </svg>
);
