"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";

export interface GithubProfile {
  username: string;
  id: string;
  repositories_url: string;
  avatar_url: string;
  name: string;
}

const GithubContext = createContext<GithubProfile | null>(null);

export function GithubProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<GithubProfile | null>(null);
  const id = session?.user?.id;

  useEffect(() => {
    if (id) {
      fetch(`https://api.github.com/user/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setUser({
            id: id,
            username: (data.login as string) || "",
            repositories_url: data.repos_url || "",
            avatar_url: data.avatar_url || "",
            name: data.name || "",
          });

          console.log(data);
        });
    }
  }, [id, setUser]);

  return (
    <GithubContext.Provider value={user}>{children}</GithubContext.Provider>
  );
}

export function useGithubProfile(): GithubProfile | null {
  const context = useContext(GithubContext);
  if (context === undefined) {
    throw new Error("useGithubProfile must be used within a GithubProvider");
  }
  return context;
}
