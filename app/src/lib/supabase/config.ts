export function hasSupabasePublicConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function hasSupabaseAdminConfig() {
  return hasSupabasePublicConfig() && Boolean(process.env.SUPABASE_SECRET_KEY);
}

export function requirePublicConfig() {
  if (!hasSupabasePublicConfig()) {
    throw new Error("Supabase todavía no está configurado.");
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
  };
}
