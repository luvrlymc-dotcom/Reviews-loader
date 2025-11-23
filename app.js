// server.js
import express from "express";
import cors from "cors";
import admin from "firebase-admin";

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// Firebase Admin Hard-code
// =======================
const serviceAccount = {
  "type": "service_account",
  "project_id": "reviews-updator-luvrlygpt",
  "private_key_id": "292173723032abcdef1234567890abcdef",
  "private_key": `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD...
...dòng private key tiếp tục ở đây...
...dòng cuối cùng của key...
-----END PRIVATE KEY-----`,
  "client_email": "firebase-adminsdk-xxxx@reviews-updator-luvrlygpt.iam.gserviceaccount.com",
  "client_id": "292173723032",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxx@reviews-updator-luvrlygpt.iam.gserviceaccount.com"
};

// Khởi tạo Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://reviews-updator-luvrlygpt-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();

// =======================
// API nhận review
// =======================
app.post("/api/review", async (req, res) => {
  const { rating, review } = req.body;

  if (!rating || !review) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await db.ref("reviews").push({
      rating,
      review,
      time: Date.now()
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Firebase write failed" });
  }
});

// =======================
// API lấy danh sách review
// =======================
app.get("/api/reviews", async (req, res) => {
  try {
    const snapshot = await db.ref("reviews").orderByChild("time").once("value");
    const data = snapshot.val() || {};
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Firebase read failed" });
  }
});

// =======================
// Health check
// =======================
app.get("/", (req, res) => {
  res.send("Firebase Server OK");
});

// =======================
// Start server
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server đang chạy trên port " + PORT));
