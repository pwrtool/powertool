import type { DefaultUser } from "next-auth";

// next auth has a uid field in the token, but it's not in the types
declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      id: string;
    };
  }
}

declare module "next-auth/jwt/types" {
  interface JWT {
    uid: string;
  }
}
