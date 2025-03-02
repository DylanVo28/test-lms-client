const RadioCustom = ({ value, onChange, children }: any) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <input
          id="default-radio-1"
          type="radio"
          checked={value}
          onChange={(e) => {
            onChange && onChange(e.target.checked);
          }}
          name="custom-radio"
          className="custom-radio"
        />
        {children && children}
      </div>
    </>
  );
};
export default RadioCustom;
