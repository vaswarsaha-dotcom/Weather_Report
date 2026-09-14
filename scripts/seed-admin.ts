// scripts/seed-admin.ts
// Usage: npm run seed:admin -- --email you@company.com --password "Str0ngPass!1" --name "You"
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

function parseArgs() {
  const args: Record<string, string> = {};
  process.argv.slice(2).forEach((arg, i, arr) => { if (arg.startsWith("--")) args[arg.slice(2)] = arr[i + 1]; });
  return args;
}

async function main() {
  const { email, password, name } = parseArgs();
  if (!email || !password || !name) {
    console.error('Usage: npm run seed:admin -- --email you@company.com --password "Str0ngPass!1" --name "You"');
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const passwordHash = await bcrypt.hash(password, 12);

  const { data: existing } = await supabase.from("users").select("id, role").eq("email", email.toLowerCase().trim()).maybeSingle();

  if (existing) {
    const { error } = await supabase.from("users").update({ role: "admin" }).eq("id", existing.id);
    if (error) throw error;
    console.log(`✓ Promoted existing user ${email} to admin.`);
  } else {
    const { error } = await supabase.from("users").insert({
      email: email.toLowerCase().trim(), name, password_hash: passwordHash, role: "admin",
    });
    if (error) throw error;
    console.log(`✓ Created admin account for ${email}.`);
  }
}

main().catch((err) => { console.error("Seed failed:", err); process.exit(1); });