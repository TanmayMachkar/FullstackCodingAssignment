"use server";

import { auth } from "@src/lib/auth/authConfig";

export const getImage = async () => {
  const session = await auth();
  if (session) {
    return session.user.image;
  }
};