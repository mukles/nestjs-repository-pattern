import { Permission, Role } from "@repo/shared-types";
import { SignJWT, decodeJwt, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

interface SessionPayload {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined,
): Promise<SessionPayload | null> {
  if (!session) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.log("Failed to verify session", error);
    return null;
  }
}

export async function createSession(accessToken: string, refreshToken: string) {
  const decoded = decodeJwt(accessToken);

  const userId = String(decoded.sub);
  const expiresAt = new Date(decoded.exp! * 1000);
  const session = await encrypt({
    userId,
    accessToken,
    refreshToken,
    expiresAt,
  });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  const { roles, permissions } = decodeJwt(session?.accessToken || "");

  if (!session?.userId) {
    redirect("/login");
  }

  return {
    isAuth: true,
    userId: session.userId,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    roles: (roles as Role[]) || [],
    permissions: (permissions as Permission[]) || [],
  };
});
