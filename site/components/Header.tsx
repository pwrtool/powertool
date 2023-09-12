import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-base-200 p-4 text-2xl font-bold flex flex-row">
      <Link href="/">Powertool</Link>
      <span className="w-full" />
      <nav>
        <Link href="/docs">Docs</Link>
        <Link href="/registry">Registry</Link>
      </nav>
    </header>
  );
}
