type Props = React.SVGProps<SVGSVGElement> & { size?: number };

export const CaretLeft = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path
      d="M160 48 80 128l80 80"
      stroke="currentColor"
      strokeWidth="16"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CaretRight = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path
      d="M96 48l80 80-80 80"
      stroke="currentColor"
      strokeWidth="16"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowClockwise = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path
      d="M200 56v48h-48"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
    />
    <path
      d="M216 128a88 88 0 1 1-24-61.94"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
    />
  </svg>
);
