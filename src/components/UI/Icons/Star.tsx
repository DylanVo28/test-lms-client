type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const Star = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path d="M128 24l28.84 58.5 64.66 9.4-46.75 45.6 11.04 64.5L128 168l-57.79 34 11.04-64.5-46.75-45.6 64.66-9.4Z" />
  </svg>
);

export default Star;
