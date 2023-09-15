import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Header() {
  return (
    <header className="bg-base-200 p-4 text-2xl align-middle font-bold flex flex-row">
      <Link href="/" className="text-4xl">
        Powertool
      </Link>
      <nav className="ml-auto">
        <Link className="align-middle w-18" href="/docs">
          📗 Docs
        </Link>
        <Link className="align-middle w-18" href="/kits">
          🧰 Kits
        </Link>
        <AuthButton />
      </nav>
    </header>
  );
}
