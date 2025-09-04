type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const User = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path d="M128 24a56 56 0 1 0 56 56A56.06 56.06 0 0 0 128 24Zm0 96a40 40 0 1 1 40-40 40 40 0 0 1-40 40Zm92 88a12 12 0 0 1-12 12H48a12 12 0 0 1-12-12 84 84 0 0 1 168 0Z" />
  </svg>
);

export default User;
