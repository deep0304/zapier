"use client";
import { AppBar } from "@/components/AppBar";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { Input } from "@/components/Input";
import { SecondFeature } from "@/components/SecondFeature";
import { useRouter } from "next/navigation";
import { networkInterfaces } from "os";
import { useRef, useState } from "react";

export default function () {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState({});
  //   const usernameRef = useRef();
  //   const passwordRef = useRef();
  //   const emailRef = useRef();
  const signupHandle = async () => {
    console.log(username);
    console.log(email);
    console.log(password);
    const userData = {
      username: username,
      email: email,
      password: password,
    };
    //     if (!data) {
    //       return router.push("/signup");
    //     }
    console.log(JSON.stringify(userData));
    console.log(JSON.stringify(userData));
    const response = await fetch("http://localhost:3000/api/v1/user/signup", {
      method: "POST",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.log("try again please");
    }
    const recievedResponse = await response.json();
    console.log(recievedResponse);
    const token = recievedResponse.token;
    if (!token) {
      alert("try again something went wrong");
      router.push("/signup");
    }
    await new Promise((r) => setTimeout(r, 2000));
    localStorage.setItem("userToken", token);
    await new Promise((r) => setTimeout(r, 2000));
    if (token) {
      router.push("/dashboard");
    }
  };
  const resetHandle = () => {
    setEmail("");
    setUsername("");
    setPassword("");
  };
  return (
    <div>
      <AppBar signUp={false} />
      <div className="flex  ">
        <div className="flex flex-col justify-center pt-16 pl-48">
          <div className="font-semibold text-3xl max-w-sm">
            Join millions worldwide who automate their work using Zapier.
          </div>
          <div className="py-2 text-lg  ">
            <SecondFeature title="Easy setup, no coding required" />
            <SecondFeature title="Free forever for core features" />
            <SecondFeature title="14-day trial of premium features & apps" />
          </div>
        </div>
        {/* creating the form */}
        <div className="pt-16 pl-40">
          <div className=" flex flex-col py-6  px-4  rounded-md border border-zinc-900">
            <Input
              label="Name"
              placeholder="Enter your name"
              //@ts-ignorec
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Input
              label="Email"
              placeholder="Enter your Email"
              //@ts-ignorec
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Input
              label="password"
              placeholder="enter your password"
              type="password"
              //@ts-ignorec
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="flex px-2 justify-between ">
              <PrimaryButton
                onClick={() => {
                  signupHandle();
                }}
              >
                Confirm
              </PrimaryButton>

              <SecondaryButton
                onClick={() => {
                  resetHandle();
                }}
              >
                Reset
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
