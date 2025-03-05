import admin from "firebase-admin";
import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config();

// ✅ Load service account JSON
const serviceAccount = JSON.parse(readFileSync(new URL("../firebase-adminsdk.json", import.meta.url)));

// ✅ Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin; // ✅ Use `export default` to support ES Modules
