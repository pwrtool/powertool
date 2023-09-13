"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useGithubProfile } from "./GithubProvider";

export default function SessionUser() {
  const { data: session, status } = useSession();
  const profile = useGithubProfile();
  console.log(session);

  return (
    <div>
      ClientComponent {status} {status === "authenticated" && session.user?.id}
      <p>{profile?.username}</p>
      <Image
        src={profile?.avatar_url ?? ""}
        width={128}
        height={128}
        alt="profile picture"
      />
    </div>
  );
}
