"use client";
import { BACKEND_URL } from "@/app/config";
import { AppBar } from "@/components/AppBar";
import { DarkButton } from "@/components/buttons/DarkButton";
import { PublishButton } from "@/components/buttons/PublshButton";
import { Input } from "@/components/Input";
import { ZapLayout } from "@/components/ZapLayout";
import useAvailableActionsAndTriggers from "@/customHooks/useAvailableActionsAndTriggers";
import { action, trigger } from "@/interfaces";
import { SocketAddress } from "net";
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
            onSelect={(
              props: null | { id: string; name: string; metadata?: any }
            ) => {
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
                    actionMetadata: props.metadata,
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
  onSelect: (
    props: null | { id: string; name: string; metadata?: any }
  ) => void;
}) {
  const actions = availableActions;
  const triggers = availableTriggers;
  const isTrigger = index === 1;
  const [selectedAction, setSelectedAction] = useState<{
    id: string;
    name: string;
  }>();
  const [step, setStep] = useState(0);
  const [metadataSelector, setMetadataSelector] = useState(false);
  return (
    <div>
      <div className=" overflow-y-auto overflow-x-hidden  bg-slate-200 bg-opacity-80 fixed flex z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow ">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
              {/* Indexing is correct */}
              <h3 className="text-xl font-semibold text-gray-900 ">
                {isTrigger ? (
                  <div>
                    <div>Choose the Trigger </div>
                  </div>
                ) : (
                  <div>
                    <div>Choose the Actions </div>
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
              {triggers && isTrigger ? (
                <div>
                  <div
                    className="py-2"
                    onClick={() => {
                      onSelect({ id: "", name: "", metadata: {} });
                    }}
                  >
                    <div className=" cursor-pointer   rounded-sm bg-stone-50 border border-gray-500 py-2 px-16 shadow-lg">
                      {"Reset Trigger"}
                    </div>
                  </div>

                  {step === 0 &&
                    triggers.map(
                      (trigger: {
                        id: string;
                        name: string;
                        image: string;
                      }) => (
                        <div
                          className="py-2 cursor-pointer"
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
                <div>
                  {!metadataSelector ? (
                    <div>
                      <div
                        className="py-2 cursor-pointer"
                        onClick={() => {
                          onSelect({ id: "", name: "" });
                        }}
                      >
                        <div className=" rounded-sm  bg-stone-50 border border-gray-500 py-2 px-16 shadow-lg">
                          {"Reset Action"}
                        </div>
                      </div>

                      {actions ? (
                        actions.map(
                          (action: {
                            id: string;
                            name: string;
                            image: string;
                          }) => (
                            <div
                              className="py-2 cursor-pointer"
                              onClick={() => {
                                setStep((s) => s + 1);
                                setSelectedAction({
                                  id: action.id,
                                  name: action.name,
                                });
                                setMetadataSelector(true);
                              }}
                            >
                              <div className=" rounded-sm flex  justify-center space-x-4 bg-stone-50 border border-gray-500 py-2 px-16 shadow-lg">
                                <div className="">
                                  <img
                                    src={action.image}
                                    width={35}
                                    height={35}
                                  />
                                </div>
                                <div>
                                  {action.name ? action.name : "Trigger"}
                                </div>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div></div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {step === 1 && selectedAction?.name === "sendEmails" && (
                        <EmailSelector
                          setMetadataSelector={setMetadataSelector}
                          setMetadata={(metadata) => {
                            onSelect({
                              ...selectedAction,
                              metadata,
                            });
                          }}
                        />
                      )}
                      {step === 1 && selectedAction?.name === "sendSol" && (
                        <AddressSelector
                          setMetadataSelector={setMetadataSelector}
                          setMetadata={(metadata) => {
                            onSelect({
                              ...selectedAction,
                              metadata,
                            });
                          }}
                        />
                      )}
                    </div>
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
const EmailSelector = ({
  setMetadataSelector,
  setMetadata,
}: {
  setMetadataSelector: any;
  setMetadata: (params: any) => void;
}) => {
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");

  return (
    <div>
      <Input
        label="To"
        placeholder="type email Address"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Body"
        placeholder="type body"
        onChange={(e) => setBody(e.target.value)}
      />
      <PublishButton
        onClick={() => {
          setMetadata({ email, body });

          setMetadataSelector(false);
        }}
      >
        Submit
      </PublishButton>
    </div>
  );
};
const AddressSelector = ({
  setMetadataSelector,
  setMetadata,
}: {
  setMetadataSelector: any;
  setMetadata: (params: any) => void;
}) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  return (
    <div>
      <Input
        label="Reciever Address"
        placeholder="Sol Wallet Address"
        onChange={(e) => setAddress(e.target.value)}
      />
      <Input
        label="Amount"
        placeholder="Enter amount to Send"
        onChange={(e) => setAmount(e.target.value)}
      />
      <PublishButton
        onClick={() => {
          setMetadata({ address, amount });
          setMetadataSelector(false);
        }}
      >
        Submit
      </PublishButton>
    </div>
  );
};

