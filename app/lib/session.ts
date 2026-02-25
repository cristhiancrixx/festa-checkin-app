import { getIronSession, IronSessionData } from "iron-session";
import { cookies } from "next/headers";

export type AppRole = "ADMIN" | "STAFF";

export interface SessionData extends IronSessionData {
  role?: AppRole;
}

export async function getSession() {
  const password = process.env.SESSION_PASSWORD;
  if (!password || password.length < 32) {
    throw new Error("SESSION_PASSWORD precisa ter 32+ caracteres");
  }

  return getIronSession<SessionData>(await cookies(), {
    cookieName: "festa_session",
    password,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
