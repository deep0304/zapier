"use client";
import { BACKEND_URL } from "@/app/config";
import { AppBar } from "@/components/AppBar";
import { DarkButton } from "@/components/buttons/DarkButton";
import { Popup } from "@/components/Popup";
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
  const [availableTriggers, setAvailableTriggers] = useState<
    {
      id: string;
      name: string;
    }[]
  >([]);
  useEffect(() => {
    const getTriggers = async () => {
      try {
        console.log("inside the fuction");
        const token = localStorage.getItem("userToken");
        const response = await fetch(`${BACKEND_URL}/api/v1/actions/triggers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? token : "",
          },
        });
        if (!response) {
          return console.log("triggers not recieved");
        }
        const receivedTriggers = await response.json();
        setAvailableTriggers(receivedTriggers);
        return;
      } catch (error) {
        console.log(
          "the error while getting the triggers inside the effect",
          error
        );
      }
    };
    getTriggers();
  }, []);

  useEffect(() => {
    console.log("Available triggers are the : ", availableTriggers);
  }, [availableTriggers]);

  return (
    <div>
      <AppBar />
      <div className="min-h-screen w-full bg-gray-200 flex flex-col justify-center">
        <div className="flex justify-center">
          <div className="flex flex-col justify-center">
            <ZapLayout
              name={selectedTrigger ? selectedTrigger : "Trigger"}
              index={1}
              onClick={() => (
                <div>
                  {availableTriggers.map((trigger, index) => (
                    <div key={index}></div>
                  ))}
                </div>
              )}
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
                  onClick={() => <div></div>}
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
          <Popup data={data} onClick={handletriggerClick} />
        </div>
      </div>
    </div>
  );
}
const data = {
  id: "123440",
  name: "webhooks",
  type: "trigger",
};
const handletriggerClick = () => {
  console.log("working fine");
};
