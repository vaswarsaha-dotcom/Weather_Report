/**
 * Seed or promote an admin user.
 *
 * Usage:
 *   npm run seed:admin -- --email you@company.com --password "Str0ngPass!" --name "You"
 *
 * If a user with that email already exists, it's promoted to admin.
 * Otherwise a new admin account is created with the given credentials.
 */
import "dotenv/config";
import { connectDB } from "../lib/db";
import { User } from "../models/User";
import { hashPassword } from "../lib/auth";

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : undefined;
}

async function main() {
  const email = getArg("--email");
  const password = getArg("--password");
  const name = getArg("--name") ?? "Admin";

  if (!email || !password) {
    console.error('Usage: npm run seed:admin -- --email you@company.com --password "Str0ngPass!" --name "You"');
    process.exit(1);
  }

  await connectDB();

  let user = await User.findOne({ email });
  if (user) {
    user.role = "admin";
    await user.save();
    console.log(`Promoted existing user ${email} to admin.`);
  } else {
    const passwordHash = await hashPassword(password);
    user = await User.create({ name, email, passwordHash, role: "admin" });
    console.log(`Created new admin user ${email}.`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
