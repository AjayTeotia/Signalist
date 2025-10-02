"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/better-auth/auth";
import { inngest } from "../inngest/client";

export async function signUpWithEmail({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) {
  try {
    const response = await auth.api.signUpEmail({
      body: { email, password, name: fullName },
    });

    if (response) {
      // Send event data to the external API
      await fetch("https://pingpanda-aj.vercel.app/api/v1/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINGPANDA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: "signalist_new_user",
          fields: {
            userId: response.user.id, // Ensure this is correct
            email: email,
            fullName: fullName,
            country: country,
            // investmentGoals: investmentGoals,
            // riskTolerance: riskTolerance,
            // preferredIndustry: preferredIndustry,
          },
        }),
      });

      // Also trigger Inngest event
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }

    return { success: true, data: response };
  } catch (e) {
    console.log("Error signing up:", e);
    return { success: false, error: "Error signing up" };
  }
}

export async function signInWithEmail({ email, password }: SignInFormData) {
  try {
    const response = await auth.api.signInEmail({ body: { email, password } });

    return { success: true, data: response };
  } catch (e) {
    console.log("Error signing in:", e);
    return { success: false, error: "Error signing in" };
  }
}

export async function signOut() {
  try {
    await auth.api.signOut({ headers: await headers() });
  } catch (e) {
    console.log("Sign out failed", e);
    return { success: false, error: "Sign out failed" };
  }
}
