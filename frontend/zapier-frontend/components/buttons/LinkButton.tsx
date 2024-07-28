import { ReactNode } from "react";

export const LinkButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => {
  return (
    <div
      className="border flex justify-center text-xs p-1 px-2 mx-2 rounded-sm bg-slate-50 cursor-pointer hover:bg-slate-200"
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </div>
  );
};
