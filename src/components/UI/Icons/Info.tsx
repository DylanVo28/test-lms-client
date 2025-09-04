type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const Info = ({ size = 16, ...props }: Props) => (
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
    <circle cx="128" cy="92" r="10" />
    <path d="M120 120h16v56" stroke="currentColor" strokeWidth="12" />
  </svg>
);

export default Info;
