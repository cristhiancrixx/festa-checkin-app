import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export type AppRole = "ADMIN" | "STAFF";

export type SessionData = {
  user?: {
    id: string;
    role: AppRole;
  };
};

const sessionOptions = {
  password: process.env.SESSION_PASSWORD!,
  cookieName: "festa_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}