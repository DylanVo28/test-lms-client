type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const Copy = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path d="M168 24H88a16 16 0 0 0-16 16v16H56a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h80a16 16 0 0 0 16-16v-16h16a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16Zm-32 176H56V72h80Zm32-32h-16V56H88V40h80Z" />
  </svg>
);

export default Copy;
