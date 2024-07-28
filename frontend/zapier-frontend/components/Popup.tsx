import { trigger } from "@/interfaces";
import { useRef } from "react";
interface data {
  triggers: trigger[];
  type: string;
}

export const Popup = ({
  data,
  onClick,
}: {
  data: data;
  onClick: () => void;
}) => {
  return (
    <div className="flex rounded z-10 bg-zinc-100 justify-center h-[400px] w-[400px] overflow-y-auto  border border-gray-600">
      <div>
        <div className="py-6">
          <div className="text-3xl flex font-semibold overflow-hidden border-b-0 border-gray-400">
            <div className="pr-2">Choose the </div>
            <div>{data.type ? data.type : "trigger"}</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="text-lg font-medium py-2 ">
            {data.triggers.map((trigger) => (
              <div className="py-2" onClick={onClick}>
                <div className=" rounded-sm bg-stone-50 border border-gray-500 py-2 px-16 shadow-lg">
                  {trigger.name ? trigger.name : "Trigger"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
