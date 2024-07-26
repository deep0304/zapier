import { ReactNode } from "react";

export const SecondaryButton = ({
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
      }  text-black rounded-3xl self-center cursor-pointer border border-gray-900   hover:bg-slate-100 `}
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </div>
  );
};
