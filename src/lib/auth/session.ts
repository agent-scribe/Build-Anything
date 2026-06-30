import { getServerSession } from "next-auth";
import { authOptions } from "./options";

/** Get the current user's session on the server side. */
export async function getSession() {
  return getServerSession(authOptions);
}

/** Get the current user ID or null. */
export async function getUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.id ?? null;
}
