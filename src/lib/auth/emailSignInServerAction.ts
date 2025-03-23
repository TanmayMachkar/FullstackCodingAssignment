"use server";

import { signIn } from "@src/lib/auth/authConfig";
import Nodemailer from "next-auth/providers/nodemailer";

export const handleEmailSignIn = async (email: string) => {
  try {
    await signIn("nodemailer", { email, callbackUrl: "/dashboard" });
  } catch (error) {
    throw error;
  }
};