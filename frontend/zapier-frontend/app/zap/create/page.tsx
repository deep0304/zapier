"use client";
import { BACKEND_URL } from "@/app/config";
import { AppBar } from "@/components/AppBar";
import { DarkButton } from "@/components/buttons/DarkButton";
import { PublishButton } from "@/components/buttons/PublshButton";
import { ZapLayout } from "@/components/ZapLayout";
import useAvailableActionsAndTriggers from "@/customHooks/useAvailableActionsAndTriggers";
import { action, trigger } from "@/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function () {
  const router = useRouter();
  const [selectedTrigger, setSelectedTrigger] = useState<{
    id: string;
    name: string;
  }>();
  const [selectedActions, setSelectedActions] = useState<
    {
      index: number;
      availableActionId: string;
      availableActionName: string;
      actionMetadata: object;
    }[]
  >([]);

  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);
  const { availableTriggers, availableActions } =
    useAvailableActionsAndTriggers();

  // not affecting if removed
  //-----------------------------------------------------
  useEffect(() => {
    console.log("Available triggers are the : ", availableTriggers);
    console.log("Available actions: ", availableActions);
  }, [availableTriggers, availableActions]);
  //-------------------------------------------------
  const handleCreateZap = async ({
    selectedActions,
    selectedTrigger,
  }: {
    selectedActions: {
      index: number;
      availableActionId: string;
      availableActionName: string;
      actionMetadata: object;
    }[];
    selectedTrigger: { id: string; name: string };
  }) => {
    const token = localStorage.getItem("userToken");
    const actionsData = selectedActions.map((action) => ({
      availableActionId: action.availableActionId,
      sortingOrder: action.index,
      actionMetadata: action.actionMetadata,
    }));
    if (!selectedTrigger || !selectedActions) {
      return;
    }
    try {
      const bodyData = {
        availableTriggerId: selectedTrigger.id,
        triggerMetadata: {},
        actions: actionsData,
      };

      //       // triggerMetadata: z.any().optional(),
      //   actions: z.array(
      //     z.object({
      //       availableActionId: z.string(),
      //       sortingOrder: z.number(),
      //       actionMetadata: z.any().optional(),
      //     })
      //   ),
      const response = await fetch(`${BACKEND_URL}/api/v1/zap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? token : "",
        },
        body: JSON.stringify(bodyData),
      });
      if (!response) {
        alert("Zap not published, Please try Again");
        return;
      }
      const recievedResponse = await response.json();
      await new Promise((r) => setTimeout(r, 2000));

      router.push("/dashboard");
      return;
    } catch (error) {
      console.log("the error while publishing the zap", error);
    }
  };

  return (
    <div className="py-4">
      <AppBar />
      <div className="min-h-screen w-full bg-stone-100 flex flex-col justify-center">
        <div className="flex justify-center">
          <div className="flex flex-col justify-center">
            <ZapLayout
              name={selectedTrigger?.name ? selectedTrigger.name : "Trigger"}
              index={1}
              onClick={() => setSelectedIndex(1)}
            />
            {selectedActions.map((action, index) => (
              <div>
                <ZapLayout
                  name={
                    action.availableActionName
                      ? action.availableActionName
                      : "Action"
                  }
                  index={action.index}
                  onClick={() => setSelectedIndex(action.index)}
                />
              </div>
            ))}
            <div className="py-4">
              <DarkButton
                onClick={() => {
                  setSelectedActions((a) => [
                    ...a,
                    {
                      index: a.length + 2,
                      availableActionId: "",
                      availableActionName: "",
                      actionMetadata: {},
                    },
                  ]);
                }}
              >
                <div className="text-2xl">+</div>
              </DarkButton>
            </div>
            <PublishButton
              onClick={() => {
                handleCreateZap({ selectedActions, selectedTrigger });
              }}
            >
              Publish Zap
            </PublishButton>
          </div>
        </div>
        {selectedIndex ? (
          <Modal
            index={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            availableActions={availableActions}
            availableTriggers={availableTriggers}
            onSelect={(props: null | { id: string; name: string }) => {
              if (props === null) {
                setSelectedIndex(null);
                return;
              }
              if (selectedIndex === 1) {
                setSelectedTrigger({
                  id: props?.id,
                  name: props?.name,
                });
              } else {
                setSelectedActions((a) => {
                  let newActions = [...a];
                  newActions[selectedIndex - 2] = {
                    index: selectedIndex,
                    availableActionName: props.name,
                    availableActionId: props.id,
                    actionMetadata: {},
                  };
                  return newActions;
                });
              }

              setSelectedIndex(null);
            }}
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
function Modal({
  index,
  setSelectedIndex,
  availableActions,
  availableTriggers,
  onSelect,
}: {
  index: number;
  setSelectedIndex: any;
  availableActions?: any;
  availableTriggers?: any;
  onSelect: (props: null | { id: string; name: string }) => void;
}) {
  const actions = availableActions;
  const triggers = availableTriggers;
  console.log("the available actions  inside the model", actions);
  console.log("the triggers inside the model: ", triggers);
  return (
    <div>
      <div className=" overflow-y-auto overflow-x-hidden  bg-slate-200 bg-opacity-80 fixed flex z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
              {/* Indexing is correct */}
              <h3 className="text-xl font-semibold text-gray-900 ">
                {index === 1 ? (
                  <div>
                    <div>Choooe the Trigger </div>
                  </div>
                ) : (
                  <div>
                    <div>Choooe the Actions </div>
                  </div>
                )}
              </h3>
              <button
                onClick={() => {
                  onSelect(null);
                }}
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  className="w-3 h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5">
              {triggers && index === 1 ? (
                <div>
                  <div
                    className="py-2"
                    onClick={() => {
                      onSelect({ id: "", name: "" });
                    }}
                  >
                    <div className=" rounded-sm bg-stone-50 border border-gray-500 py-2 px-16 shadow-lg">
                      {"Reset Trigger"}
                    </div>
                  </div>

                  {triggers.map(
                    (trigger: { id: string; name: string; image: string }) => (
                      <div
                        className="py-2"
                        onClick={() => {
                          onSelect({ id: trigger.id, name: trigger.name });
                        }}
                      >
                        <div className=" rounded-sm flex justify-center space-x-4 bg-stone-50 border border-gray-500 py-2 px-16 shadow-lg">
                          <div className="">
                            <img src={trigger.image} width={35} height={35} />
                          </div>
                          <div>{trigger.name ? trigger.name : "Trigger"}</div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                //      {data.triggers.map((trigger) => (
                //   <div className="py-2" onClick={onClick}>
                //     <div className=" rounded-sm bg-stone-50 border border-gray-500 py-2 px-16 shadow-lg">
                //       {trigger.name ? trigger.name : "Trigger"}
                //     </div>
                //   </div>
                // ))}

                <div>
                  <div
                    className="py-2"
                    onClick={() => {
                      onSelect({ id: "", name: "" });
                    }}
                  >
                    <div className=" rounded-sm bg-stone-50 border border-gray-500 py-2 px-16 shadow-lg">
                      {"Reset Action"}
                    </div>
                  </div>
                  {actions ? (
                    actions.map(
                      (action: { id: string; name: string; image: string }) => (
                        <div
                          className="py-2"
                          onClick={() => {
                            onSelect({ id: action.id, name: action.name });
                          }}
                        >
                          <div className=" rounded-sm flex justify-center space-x-4 bg-stone-50 border border-gray-500 py-2 px-16 shadow-lg">
                            <div className="">
                              <img src={action.image} width={35} height={35} />
                            </div>
                            <div>{action.name ? action.name : "Trigger"}</div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div></div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
