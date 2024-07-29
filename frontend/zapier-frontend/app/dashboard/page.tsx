"use client";
import { AppBar } from "@/components/AppBar";
import { DarkButton } from "@/components/buttons/DarkButton";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
import axios from "axios";
import { CheckBox } from "@/components/CheckBox";
import { LinkButton } from "@/components/buttons/LinkButton";
import { useRouter } from "next/navigation";

interface zap {
  id: string;
  triggerId: string;
  userId: number;
  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
      image: string;
    };
  };
  actions: {
    id: string;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    type: {
      id: string;
      name: string;
      image: string;
    };
  }[];
}

const useZaps = () => {
  const [loading, setLoading] = useState(true);
  const [zaps, setZaps] = useState<zap[]>([]);
  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        return;
      }
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/zap/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const recievedResponse = await response.json();
        setZaps(recievedResponse);
      } catch (error) {
        console.log("the error while geeting the zaps :  ", error);
      }
      setLoading(false);
    };
    run();
  }, []);
  return { loading, zaps };
};

export default function () {
  const [token, setToken] = useState<string | null>("");
  const { loading, zaps } = useZaps();
  const router = useRouter();
  console.log(zaps);
  useEffect(() => {
    const tokenFromLocal = localStorage.getItem("userToken");
    if (tokenFromLocal) {
      setToken(tokenFromLocal);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    const run = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/user/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        //   const recievedResponse = await response.json();
      } catch (error) {
        console.log("the error while the running second effect", error);
      }
    };
    run();
  }, [token]);
//   const handle = async () => {
//     try {
//       const response = await fetch(`${BACKEND_URL}/api/v1/zap`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: token ? token : "",
//         },
//       });
//     } catch (error) {
//       console.log("the error on using the create Button", error);
//     }
//   };

  return (
    <div>
      <AppBar />
      <div className="pt-8 flex justify-center">
        <div className="max-w-screen-md w-full ">
          <div className="flex justify-between pr-8   ">
            <div className="text-2xl font-bold pl-6">MyZaps</div>
            <DarkButton
              onClick={() => {
                router.push("/zap/create");
              }}
            >
              Create
            </DarkButton>
          </div>
          <div className="border-b-2 pt-4 w-full max-w-screen-2xl border-gray-100 "></div>

          <div className="flex justify-center w-full pt-8">
            {loading ? "loading..." : <ZapTable zaps={zaps} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function ZapTable({ zaps }: { zaps: zap[] }) {
  const router = useRouter();
  return (
    <div className="max-w-4xl w-full ">
      <div className="flex">
        <div className="flex-1">
          <CheckBox />
        </div>
        <div className="flex-1">Name</div>
        <div className="flex-1">Last Edit</div>
        <div className="flex-1">Webhook Url</div>
        <div className="flex-1">GO</div>
      </div>
      <div className="">
        {zaps.map((z) => (
          <div className="flex  border-2 py-4 text-sm px-4 w-full max-w-screen-2xl border-gray-100 ">
            <div className="flex-1 flex items-center ">
              <img src={z.trigger.type.image} className="w-6 h-6 pr-1" />
              {z.actions.map((a) => (
                <div className="w-8 h-8 pr-1">
                  <img src={a.type.image} />
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div>{z.id}</div>
            </div>
            <div className="flex-1">Nov 12,2023</div>
            <div className="flex-1">{`${HOOKS_URL}/1/${z.id}`}</div>
            <div className="flex-1">
              <LinkButton
                onClick={() => {
                  router.push("/zap" + z.id);
                }}
              >
                Go
              </LinkButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
