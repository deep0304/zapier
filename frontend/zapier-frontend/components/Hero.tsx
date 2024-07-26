"use client";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { SecondaryButton } from "./buttons/SecondaryButton";
import { Feature } from "./Feature";

export const Hero = () => {
  const router = useRouter();
  return (
    <div>
      <div className="flex justify-center">
        <div className="pt-12 text-5xl font-semibold text-center max-w-2xl">
          Automate as fast as you can type
        </div>
      </div>
      <div className="flex py-3 justify-center text-center">
        <div className="max-w-4xl font-medium text-xl">
          AI gives you automation superpowers, and Zapier puts them to work.
          Pairing AI and Zapier helps you turn ideas into workflows and bots
          that work for you.
        </div>
      </div>
      <div className="flex justify-center pt-8 pb-8 space-x-2 max-h-10 text-sm">
        <PrimaryButton
          size="big"
          onClick={() => {
            router.push("/signup");
          }}
        >
          Start Free With Email
        </PrimaryButton>
        <SecondaryButton
          size="big"
          onClick={() => {
            router.push("/signup");
          }}
        >
          Start Free With Google
        </SecondaryButton>
      </div>
      <div className="flex justify-center pt-5">
        <Feature
          title="Free forever "
          subTitle="for core
            features"
        />
        <Feature title="More apps " subTitle="than any other platform" />
        <Feature title="Cutting-edge " subTitle="AI features" />
      </div>
      
    </div>
  );
};
