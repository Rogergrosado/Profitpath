import admin from "../config/firebaseAdmin.js"; // ✅ Ensure `.js` extension

export async function verifyUser(req, res) {
  const token = req.body.token; // Token should be sent in the request body

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ message: "User verified", user: decodedToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
