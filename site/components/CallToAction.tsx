import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="mx-auto flex flex-col justify-center align-middle">
      <h1 className="text-4xl font-bold text-center mb-8">
        Stop Repeating Yourself
      </h1>
      <Link
        className="btn btn-primary rounded-xl max-w-[12rem] mx-auto"
        href="/docs/install"
      >
        Install Now
      </Link>
    </section>
  );
}
