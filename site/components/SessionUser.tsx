"use client";

import { useSession } from "next-auth/react";

export default function SessionUser() {
  const { data: session, status } = useSession();
  console.log(session);

  return (
    <div>
      ClientComponent {status} {status === "authenticated" && session.user?.id}
    </div>
  );
}
