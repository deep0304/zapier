import { AppBar } from "@/components/AppBar";
import { Hero } from "@/components/Hero";
import { HeroVideo } from "@/components/HeroVideo";
import Image from "next/image";

export default function Home() {
  return (
    <main className=" pb-48">
      <AppBar />
      <Hero />
      <div className="flex justify-center pt-6">
        <HeroVideo />
      </div>
    </main>
  );
}
