type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const PencilSimpleLine = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path
      d="M216.49 79.51 176.49 39.51a12 12 0 0 0-17 0L40 159v57h57L216.49 96.49a12 12 0 0 0 0-17Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
    />
  </svg>
);

export default PencilSimpleLine;
