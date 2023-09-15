"use client";
import Image from "next/image";
import { useGithubProfile } from "./GithubProvider";
import Link from "next/link";

export default function AuthButton() {
  const profile = useGithubProfile();

  const signedInMenu = (
    <>
      <li>
        <Link href="/me">🧰 My Kits</Link>
      </li>
      <li>
        <Link href="/api/auth/signout">🚪 Sign Out</Link>
      </li>
    </>
  );

  const signedOutMenu = (
    <>
      <li>
        <Link href="/api/auth/signin">🚪 Sign In</Link>
      </li>
    </>
  );

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="no-summary">
        <Image
          className="rounded-full border-4 border-text-200 mx-2 max-w-sm max-h-sm"
          width="64"
          height="64"
          src={profile === null ? "/no_pfp.png" : profile.avatar_url}
          alt="Profile Picture"
        />
      </label>
      <ul
        tabIndex={0}
        className="shadow menu dropdown-content p-2 bg-neutral z-[1] w-52 rounded-lg"
      >
        {profile === null ? signedOutMenu : signedInMenu}
      </ul>
    </div>
  );
}
