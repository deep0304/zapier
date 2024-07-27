"use client";
import { useRouter } from "next/navigation";
import { LinkButton } from "./buttons/LinkButton";
import { PrimaryButton } from "./buttons/PrimaryButton";

export const AppBar = ({ signUp = true }: { signUp?: boolean }) => {
  const router = useRouter();
  return (
    <div className="border-b-2 flex justify-between">
      <div
        className="px-8 py-3 cursor-pointer font-extrabold text-xl "
        onClick={() => {
          router.push("/");
        }}
      >
        Zapier
      </div>
      <div className="flex items-center p-2 mx-3 space-x-2 ">
        <LinkButton onClick={() => {}}>Contact Sales</LinkButton>
        {!signUp ? (
          <LinkButton
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </LinkButton>
        ) : (
          <div></div>
        )}
        {signUp ? (
          <PrimaryButton
            onClick={() => {
              router.push("/signup");
            }}
          >
            SignUp
          </PrimaryButton>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};
