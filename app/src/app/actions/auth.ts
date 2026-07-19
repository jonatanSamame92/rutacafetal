"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { hasSupabasePublicConfig } from "@/lib/supabase/config";
import { phoneToAuthEmail } from "@/lib/phone";
import { firstValidationError, loginSchema, passwordSchema } from "@/lib/validation";
import type { ActionState } from "@/app/actions/types";

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  if (!hasSupabasePublicConfig()) {
    return { ok: false, message: "El acceso estará disponible cuando conectemos Supabase." };
  }

  const parsed = loginSchema.safeParse({
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { ok: false, message: firstValidationError(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: phoneToAuthEmail(parsed.data.phone),
    password: parsed.data.password,
  });
  if (error) return { ok: false, message: "No pudimos ingresar. Revisa tu celular y contraseña." };

  revalidatePath("/", "layout");
  redirect("/panel");
}

export async function logoutAction() {
  if (hasSupabasePublicConfig()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}

export async function changePasswordAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  if (!hasSupabasePublicConfig()) {
    return { ok: false, message: "El acceso todavía no está configurado." };
  }
  const parsed = passwordSchema.safeParse({
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });
  if (!parsed.success) return { ok: false, message: firstValidationError(parsed.error) };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return { ok: false, message: "Tu sesión venció. Ingresa nuevamente." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, message: "No pudimos guardar la contraseña. Inténtalo nuevamente." };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", userId)
    .select("id")
    .maybeSingle();
  if (profileError || !profile) return { ok: false, message: "La contraseña cambió, pero falta habilitar el perfil. Contacta al administrador." };

  revalidatePath("/", "layout");
  redirect("/panel");
}
