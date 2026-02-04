const CustomDateInput = ({ type, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder="Date"
      className="bg-slate-900 text-white px-3 py-2 rounded border w-full border-slate-600 outline-none invalid:text-red-400 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      value={value}
      onChange={onChange}
    />
  );
};

const Input = ({
  type = "text",
  placeholder = "",
  value = "",
  disabled = false,
  required = false,
  onChange,
  min = 0,
}) => {
  if (type === "date" || type === "datetime-local") {
    return <CustomDateInput type={type} value={value} onChange={onChange} />;
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`bg-slate-900 text-white px-3 py-2 rounded border w-full border-slate-600 outline-none invalid:text-red-400 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      min={min}
    />
  );
};
export default Input;
