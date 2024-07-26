import { ReactNode } from "react";

export const PrimaryButton = ({
  children,
  onClick,
  size = "small",
}: {
  children: ReactNode;
  onClick: () => void;
  size?: "big" | "small";
}) => {
  return (
    <div
      className={`${size === "small" ? "text-sm" : "text-md"} ${
        size === "small" ? "px-6 py-2" : "px-7 py-3 font-semibold"
      }  text-gray-100 rounded-3xl self-center cursor-pointer bg-orange-500 hover:shadow-amber-600 hover:bg-slate-50 hover:text-orange-500`}
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </div>
  );
};
