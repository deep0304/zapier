"use client";
import { BACKEND_URL } from "@/app/config";
import { AppBar } from "@/components/AppBar";
import { DarkButton } from "@/components/buttons/DarkButton";
import { Popup } from "@/components/Popup";
import { ZapLayout } from "@/components/ZapLayout";
import { action, trigger } from "@/interfaces";
import { useEffect, useState } from "react";

export default function () {
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedActions, setSelectedActions] = useState<
    {
      availabelActionId: string;
      availableActionName: string;
    }[]
  >([]);
  const [availableTriggers, setAvailableTriggers] = useState<trigger[]>([]);
  const [availableActions, setAvailableActions] = useState<action[]>([]);
  useEffect(() => {
    const getTriggers = async () => {
      try {
        console.log("inside the fuction");
        const token = localStorage.getItem("userToken");
        const response = await fetch(
          `${BACKEND_URL}/api/v1/triggers/available`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? token : "",
            },
          }
        );
        if (!response) {
          return console.log("triggers not recieved");
        }
        const receivedTriggers = await response.json();
        setAvailableTriggers(receivedTriggers.triggers);
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
    const run = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/v1/actions/available`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        const recievedData = await response.json();
        setAvailableActions(recievedData.actions);
        return;
      } catch (error) {
        console.log("Error while getting the actions ", error);
        return;
      }
    };
    run();
  }, []);
  // not affecting if removed
  //-----------------------------------------------------
  useEffect(() => {
    console.log("Available triggers are the : ", availableTriggers);
    console.log("Available actions: ", availableActions);
  }, [availableTriggers, availableActions]);
  //-------------------------------------------------
  const data = { triggers: availableTriggers, type: "trigger" };
  const handletriggerClick = () => {};

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
