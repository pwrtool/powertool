import CallToAction from "@/components/CallToAction";
import SessionUser from "@/components/SessionUser";
import Features from "@/components/Features";
import Tagline from "@/components/Tagline";

export default function Home() {
  return (
    <main>
      <Tagline />
      <Features />
      <CallToAction />
      <SessionUser />
    </main>
  );
}
