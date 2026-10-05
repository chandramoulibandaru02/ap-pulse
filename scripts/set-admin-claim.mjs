import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "node:fs";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function localProjectId() {
  try {
    const line = readFileSync(".env.local", "utf8")
      .split(/\r?\n/)
      .find((entry) => entry.startsWith("NEXT_PUBLIC_FIREBASE_PROJECT_ID="));
    return line?.split("=", 2)[1];
  } catch {
    return undefined;
  }
}

const uid = argument("--uid");
const email = argument("--email");

if ((!uid && !email) || (uid && email)) {
  console.error("Usage: node scripts/set-admin-claim.mjs --uid <firebase-uid>");
  console.error("   or: node scripts/set-admin-claim.mjs --email <admin-email>");
  process.exitCode = 1;
} else {
  try {
    const serviceAccountJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID ?? localProjectId();
    const app = getApps()[0] ?? initializeApp({
      projectId,
      credential: serviceAccountJson
        ? cert(JSON.parse(serviceAccountJson))
        : applicationDefault(),
    });
    const auth = getAuth(app);
    const user = uid ? await auth.getUser(uid) : await auth.getUserByEmail(email);

    await auth.setCustomUserClaims(user.uid, { ...user.customClaims, admin: true });
    console.log(JSON.stringify({ uid: user.uid, email: user.email ?? null, admin: true }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Firebase Admin error.";
    console.error(`Unable to assign the admin claim: ${message}`);
    process.exitCode = 1;
  }
}
