import CallToAction from "@/components/CallToAction";
import Features from "@/components/Features";
import Tagline from "@/components/Tagline";

export default function Home() {
  return (
    <main className="m-4">
      <Tagline />
      <Features />
      <CallToAction />
    </main>
  );
}
