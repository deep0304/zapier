import { ReactNode } from "react";

export const PublishButton = ({
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
      onClick={onClick}
      className={`flex flex-col justify-center px-8 py-2 cursor-pointer hover:shadow-md bg-orange-400 text-white rounded text-center`}
    >
      {children}
    </div>
  );
};
