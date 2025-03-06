import admin from "firebase-admin";
import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config();

let serviceAccount;

if (process.env.FIREBASE_ADMIN_SDK) {
  // ✅ Railway Deployment: Decode from Environment Variable
  console.log("🔄 Loading Firebase credentials from environment variable...");
  serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_ADMIN_SDK, "base64").toString("utf8"));
} else {
  try {
    // ✅ Local Development: Load JSON file
    console.log("📂 Loading Firebase credentials from file...");
    serviceAccount = JSON.parse(readFileSync(new URL("../firebase-adminsdk.json", import.meta.url)));
  } catch (error) {
    console.error("❌ Firebase credentials not found! Ensure you have either:");
    console.error("- A `firebase-adminsdk.json` file for local development");
    console.error("- The `FIREBASE_ADMIN_SDK` environment variable for Railway deployment");
    process.exit(1); // Stop the application if credentials are missing
  }
}

// ✅ Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("✅ Firebase Admin Initialized!");

export default admin; // ✅ Use `export default` to support ES Modules
