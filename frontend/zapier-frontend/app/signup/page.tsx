"use client";
import { AppBar } from "@/components/AppBar";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { Input } from "@/components/Input";
import { SecondFeature } from "@/components/SecondFeature";
import { useState } from "react";

export default function () {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState({});
  const loginClickHandle = () => {
    setData({
      name,
      email,
      password,
    });
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
                setName(e.target.value);
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
              type="password"
              label="password"
              placeholder="password"
              //@ts-ignorec
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div className="flex px-2 justify-between ">
              <PrimaryButton
                onClick={() => {
                  loginClickHandle();
                }}
              >
                Confirm
              </PrimaryButton>

              <SecondaryButton
                onClick={() => {
                  setEmail("");
                  setName("");
                  setPassword("");
                  setData({});
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
