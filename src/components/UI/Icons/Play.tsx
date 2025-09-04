type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const Play = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path d="M88 64l96 64-96 64Z" />
  </svg>
);

export default Play;
