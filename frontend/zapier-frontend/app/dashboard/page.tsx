"use client";
import { useEffect, useState } from "react";

export default function () {
  const [token, setToken] = useState<string | null>("");
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
            authorization: token,
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

  return <div>dashboard</div>;
}
