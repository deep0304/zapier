"use client";
import { AppBar } from "@/components/AppBar";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { Input } from "@/components/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const loginHandle = async () => {
    const userdata = {
      username,
      password,
    };
    console.log(userdata);
    const response = await fetch("http://localhost:3000/api/v1/user/signin", {
      method: "POST",
      body: JSON.stringify(userdata),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("resposne: ", response);
    if (!response.ok) {
      router.push("/login");
    }
    const recievedResponse = await response.json();
    console.log("recievedRespons:  ", recievedResponse);
    if (!recievedResponse.token) {
      alert("token not recieved, please try again");
    }

    const token = recievedResponse.token;
    localStorage.setItem("userToken", "");
    console.log("token: ", token);
    const storingResponse = localStorage.setItem("userToken", token);
    console.log("Storing response: ", storingResponse);
    await new Promise((r) => setTimeout(r, 3000));
    router.push("/dashboard");
  };

  return (
    <div>
      <AppBar />
      <div className="flex pt-28 justify-center">
        <div className="flex flex-col justify-center  pt-16 ">
          <div className="font-semibold text-4xl max-w-xl">
            Automate across your teams
          </div>
          <div className="py-2 pt-4 text-lg justify-center max-w-md">
            Zapier Enterprise empowers everyone in your business to securely
            automate their work in minutes, not months—no coding required.
          </div>
        </div>
        {/* creating the form */}
        <div className="pt-20 pl-28">
          <div className=" flex flex-col py-6  px-4  rounded-md border border-zinc-900">
            <Input
              label="username"
              placeholder="Enter your username"
              //@ts-ignore
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Input
              type="password"
              label="password"
              placeholder="password"
              //@ts-ignore
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="flex px-2 justify-between ">
              <PrimaryButton
                onClick={() => {
                  loginHandle();
                }}
              >
                Login
              </PrimaryButton>

              <SecondaryButton onClick={() => {}}>Reset</SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
