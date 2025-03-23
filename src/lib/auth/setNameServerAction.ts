"use server";

import { auth } from "@src/lib/auth/authConfig";
import { pool } from "@src/lib/postgres";

export const setName = async (name: string) => {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const uuid: string = session.user.id;

  const uuidRegExp: RegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  if (typeof uuid !== "string" || !uuidRegExp.test(uuid)) {
    throw new Error("Invalid UUID");
  }
  name = name.trim();

  await pool.query("UPDATE users SET name = $1 WHERE id = $2", [name, uuid]);

  return true;
};