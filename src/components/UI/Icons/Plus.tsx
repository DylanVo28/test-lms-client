type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const Plus = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path
      d="M128 40v176M40 128h176"
      stroke="currentColor"
      strokeWidth="16"
      strokeLinecap="round"
    />
  </svg>
);

export default Plus;
