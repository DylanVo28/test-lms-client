type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const Student = ({ size = 16, ...props }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 256 256"
    fill="currentColor"
    {...props}
  >
    <path d="M16 88l112-48 112 48-112 48-112-48Z" />
    <path
      d="M64 112v40c0 17.67 28.65 32 64 32s64-14.33 64-32v-40"
      fill="none"
      stroke="currentColor"
      strokeWidth="12"
    />
  </svg>
);

export default Student;
