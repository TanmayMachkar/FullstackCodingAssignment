"use server";

import { auth } from "@src/lib/auth/authConfig";
import { pool } from "@src/lib/postgres";

export const updateUserImage = async (image: string) => {
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

  if (typeof image !== "string" || image.trim() === "") {
    throw new Error("Invalid image URL");
  }

  await pool.query("UPDATE users SET image = $1 WHERE id = $2", [image.trim(), uuid]);

  return true;
};