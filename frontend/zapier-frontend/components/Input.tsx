import { Ref } from "react";

export const Input = ({
  label,
  placeholder,
  type = "text",
  onChange,
  ref,
}: {
  label: string;
  placeholder: string;
  type?: "text" | "password";
  onChange: (e: any) => void;
  ref?: any;
}) => {
  return (
    <div className="py-2 flex flex-col">
      <label>{label}</label>
      <input
        className="border border-gray-700 rounded-md px-5 max-w-56"
        placeholder={placeholder}
        type={type}
        ref={ref}
        onChange={onChange}
      ></input>
    </div>
  );
};
