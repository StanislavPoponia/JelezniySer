"use server";

import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import type { AuthFormState } from "@/types/auth";

const MIN_PASSWORD_LENGTH = 8;

function readLocale(formData: FormData): Locale {
  const value = formData.get("locale");
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}

function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

async function getOrigin(): Promise<string> {
  const h = await headers();
  return h.get("origin") ?? "http://localhost:3000";
}

// Перетворює код помилки Supabase на ключ з messages (auth.errors.*).
function mapAuthError(code: string | undefined): string {
  switch (code) {
    case "invalid_credentials":
      return "invalidCredentials";
    case "email_not_confirmed":
      return "emailNotConfirmed";
    case "user_already_exists":
    case "email_exists":
      return "userExists";
    case "weak_password":
      return "passwordTooShort";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "tooManyRequests";
    case "session_not_found":
    case "otp_expired":
      return "sessionMissing";
    default:
      return "generic";
  }
}

export async function signIn(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = readLocale(formData);
  const email = readString(formData, "email");
  const password = String(formData.get("password") ?? "");

  if (!email) return { error: "emailRequired" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: mapAuthError(error.code) };

  redirect({ href: "/", locale });
  return null;
}

export async function signUp(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = readLocale(formData);
  const email = readString(formData, "email");
  const fullName = readString(formData, "fullName");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (!email) return { error: "emailRequired" };
  if (password.length < MIN_PASSWORD_LENGTH) return { error: "passwordTooShort" };
  if (password !== confirm) return { error: "passwordMismatch" };

  const origin = await getOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: fullName ? { full_name: fullName } : undefined,
      emailRedirectTo: `${origin}/auth/callback?next=/${locale}`,
    },
  });

  if (error) return { error: mapAuthError(error.code) };
  // Supabase не видає помилку для вже існуючого email, а повертає користувача без identities.
  if (data.user && data.user.identities?.length === 0) {
    return { error: "userExists" };
  }

  return { success: true };
}

export async function requestPasswordReset(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const locale = readLocale(formData);
  const email = readString(formData, "email");
  if (!email) return { error: "emailRequired" };

  const origin = await getOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/${locale}/reset-password`,
  });

  if (error && error.code !== "user_not_found") {
    return { error: mapAuthError(error.code) };
  }
  // Однакова відповідь незалежно від того, чи існує акаунт.
  return { success: true };
}

export async function updatePassword(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (password.length < MIN_PASSWORD_LENGTH) return { error: "passwordTooShort" };
  if (password !== confirm) return { error: "passwordMismatch" };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: mapAuthError(error.code) };

  return { success: true };
}

export async function signOut(formData: FormData) {
  const locale = readLocale(formData);
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect({ href: "/", locale });
}
