import { applicationDefault, cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App | undefined;

function getAdminApp(): App {
  if (adminApp) return adminApp;

  const existingApp = getApps()[0];
  if (existingApp) {
    adminApp = existingApp;
    return adminApp;
  }

  const serviceAccountJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;
  try {
    adminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      credential: serviceAccountJson
        ? cert(JSON.parse(serviceAccountJson))
        : applicationDefault(),
    });
  } catch (error) {
    throw new Error(
      "Firebase Admin credentials are unavailable. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON on the server.",
      { cause: error }
    );
  }

  return adminApp;
}

export function getAdminFirestore() {
  const app = getAdminApp();
  return getFirestore(app);
}
