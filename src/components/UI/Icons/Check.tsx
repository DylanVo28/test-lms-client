type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const Check = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path
      d="M216 72 104 184 40 120"
      stroke="currentColor"
      strokeWidth="16"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Check;
