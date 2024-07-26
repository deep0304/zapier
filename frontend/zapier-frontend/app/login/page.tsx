"use client";
import { AppBar } from "@/components/AppBar";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { SecondaryButton } from "@/components/buttons/SecondaryButton";
import { Input } from "@/components/Input";
import { SecondFeature } from "@/components/SecondFeature";

export default function login() {
  return (
    <div>
      <AppBar signUp={false} />
      <div className="flex pt-8 ">
        <div className="flex flex-col justify-center pt-16 pl-48">
          <div className="font-semibold text-3xl max-w-md">
            Automate across your teams
          </div>
          <div className="py-2 text-lg justify-center max-w-md">
            Zapier Enterprise empowers everyone in your business to securely
            automate their work in minutes, not months—no coding required.
          </div>
        </div>
        {/* creating the form */}
        <div className="pt-20 pl-28">
          <div className=" flex flex-col py-6  px-4  rounded-md border border-zinc-900">
            <Input
              label="Email"
              placeholder="Enter your Email"
              //@ts-ignore
              onChange={() => {}}
            />
            <Input
              type="password"
              label="password"
              placeholder="password"
              //@ts-ignore
              onChange={() => {}}
            />
            <div className="flex px-2 justify-between ">
              <PrimaryButton onClick={() => {}}>Login</PrimaryButton>

              <SecondaryButton onClick={() => {}}>Reset</SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
