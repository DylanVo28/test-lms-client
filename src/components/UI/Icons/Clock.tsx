type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const Clock = ({ size = 16, ...props }: Props) => (
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
      strokeWidth="16"
    />
    <path
      d="M128 72v56l40 24"
      stroke="currentColor"
      strokeWidth="16"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

export default Clock;
