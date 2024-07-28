"use client";
import { BACKEND_URL } from "@/app/config";
import { AppBar } from "@/components/AppBar";
import { DarkButton } from "@/components/buttons/DarkButton";
import { ZapLayout } from "@/components/ZapLayout";
import { useEffect, useState } from "react";

export default function () {
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedActions, setSelectedActions] = useState<
    {
      availabelActionId: string;
      availableActionName: string;
    }[]
  >([]);

  const getTriggers = async () => {
    const response = await fetch(`${BACKEND_URL}/api/v1/`);
  };
  return (
    <div>
      <AppBar />
      <div className="min-h-screen w-full bg-gray-200 flex flex-col justify-center">
        <div className="flex justify-center">
          <div className="flex flex-col justify-center">
            <ZapLayout
              name={selectedTrigger ? selectedTrigger : "Trigger"}
              index={1}
            />
            <div className="py-4">
              <DarkButton
                onClick={() => {
                  setSelectedActions((a) => [
                    ...a,
                    {
                      availabelActionId: "",
                      availableActionName: "",
                    },
                  ]);
                }}
              >
                <div className="text-2xl">+</div>
              </DarkButton>
            </div>
            {selectedActions.map((action, index) => (
              <div>
                <ZapLayout
                  name={
                    action.availableActionName
                      ? action.availableActionName
                      : "Action"
                  }
                  index={2 + index}
                />
                <div className="py-4">
                  <DarkButton
                    onClick={() => {
                      setSelectedActions((a) => [
                        ...a,
                        {
                          availabelActionId: "",
                          availableActionName: "",
                        },
                      ]);
                    }}
                  >
                    <div className="text-2xl">+</div>
                  </DarkButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
