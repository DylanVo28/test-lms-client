type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const House = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path d="M218.83 103.51 141.17 33.71a20 20 0 0 0-26.34 0l-77.66 69.8A20 20 0 0 0 32 118.66V208a16 16 0 0 0 16 16h48a8 8 0 0 0 8-8v-48a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16v48a8 8 0 0 0 8 8h48a16 16 0 0 0 16-16v-89.34a20 20 0 0 0-5.17-15.15Z" />
  </svg>
);

export default House;
