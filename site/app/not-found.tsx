import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl">404 - Page Not Found</h1>
      <Link className="text-lg text-primary hover:text-primary-focus" href="/">
        Back to the homepage
      </Link>
    </div>
  );
}
