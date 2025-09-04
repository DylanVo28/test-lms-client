type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const Trash = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path d="M216 56h-40l-8-16H88l-8 16H40v16h176ZM64 88v120a16 16 0 0 0 16 16h96a16 16 0 0 0 16-16V88Z" />
  </svg>
);

export default Trash;
