"use client";
import { AppBar } from "@/components/AppBar";
import { DarkButton } from "@/components/buttons/DarkButton";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { CheckBox } from "@/components/CheckBox";

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
    };
  }[];
}

const useZaps = () => {
  const [loading, setLoading] = useState(true);
  const [zaps, setZaps] = useState<zap[]>([]);
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/zap`, {
        headers: {
          authorization: localStorage.getItem("userToken"),
        },
      })
      .then((res) => {
        console.log(res);
        setZaps(res.data.zaps);
      });

    setLoading(false);
  }, []);
  return { loading, zaps };
};

export default function () {
  const [token, setToken] = useState<string | null>("");
  const { loading, zaps } = useZaps();
  console.log(zaps);
  useEffect(() => {
    const tokenFromLocal = localStorage.getItem("userToken");
    if (tokenFromLocal) {
      setToken(tokenFromLocal);
    }
    console.log(token);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    const run = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/user/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        console.log("response is : ", response);
        const recievedResponse = await response.json();
        console.log("recieved response is : ", recievedResponse);
      } catch (error) {
        console.log("the error while the running second effect", error);
      }
    };
    run();
  }, [token]);

  return (
    <div>
      <AppBar />
      <div className="pt-8 flex justify-center">
        <div className="max-w-screen-lg w-full">
          <div className="flex justify-between pr-8">
            <div className="text-2xl font-bold pl-6">MyZaps</div>
            <DarkButton onClick={() => {}}>Create</DarkButton>
          </div>
          {loading ? "loading..." : <ZapTable zaps={zaps} />}
        </div>
      </div>
    </div>
  );
}

function ZapTable({ zaps }: { zaps: zap[] }) {
  return (
    <table className="table-fixed">
      <thead>
        <tr>
          <th>
            <CheckBox />
          </th>
          <th>Name</th>
          <th>Last Edit</th>
          <th>Running</th>
          <th></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  );
}
