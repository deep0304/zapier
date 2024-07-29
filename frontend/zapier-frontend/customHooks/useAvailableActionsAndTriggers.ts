import { BACKEND_URL } from "@/app/config";
import { useEffect, useState } from "react";

const useAvailableActionsAndTriggers = () => {
  const [availableTriggers, setAvailableTriggers] = useState([]);
  const [availableActions, setAvailableActions] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        // getting triggers
        const triggerEndResponse = await fetch(
          `${BACKEND_URL}/api/v1/triggers/available`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!triggerEndResponse) {
          return console.log("triggers not recieved");
        }

        const receivedTriggers = await triggerEndResponse.json();
        setAvailableTriggers(receivedTriggers.triggers);
        // getting the actions
        const actionEndResponse = await fetch(
          `${BACKEND_URL}/api/v1/actions/available`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(actionEndResponse);
        const recievedData = await actionEndResponse.json();
        setAvailableActions(recievedData.actions);
      } catch (error) {
        console.log(
          "the error while getting the triggers inside the effect",
          error
        );
      }
    };
    run();
  }, []);
  return { availableTriggers, availableActions };
};

export default useAvailableActionsAndTriggers;
