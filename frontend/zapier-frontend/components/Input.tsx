export const Input = ({
  label,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: "text" | "password";
  onChange: (e: any) => {};
}) => {
  return (
    <div className="py-2 flex flex-col">
      <label>{label}</label>
      <input
        className="border border-gray-700 rounded-md px-5 max-w-56"
        placeholder={placeholder}
        type={type}
        onChange={onChange}
      ></input>
    </div>
  );
};
