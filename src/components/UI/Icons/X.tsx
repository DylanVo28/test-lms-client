type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const X = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path
      d="M200 56 56 200m144 0L56 56"
      stroke="currentColor"
      strokeWidth="24"
      strokeLinecap="round"
    />
  </svg>
);

export default X;
