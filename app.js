import express from "express";
import cors from "cors";
import admin from "firebase-admin";

const app = express();
app.use(cors());
app.use(express.json());

// --- FIREBASE CONFIG HARD CODE ---
const serviceAccount = {
  "type": "service_account",
  "project_id": "test-try-smart",
  "private_key_id": "d1ebe04e18c969e8e39275be8eec4e42ec2ccba5",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBK...C5BQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-1fa4c@test-try-smart.iam.gserviceaccount.com",
  "client_id": "103737336573259774789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1fa4c%40test-try-smart.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-try-smart-default-rtdb.firebaseio.com"
});

const db = admin.database();

// --- API: Lưu dữ liệu client gửi lên ---
app.post("/save", async (req, res) => {
  try {
    const { path, data } = req.body;
    await db.ref(path).set(data);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// --- API: Lấy dữ liệu ---
app.get("/get", async (req, res) => {
  try {
    const path = req.query.path;
    const snapshot = await db.ref(path).once("value");
    res.json(snapshot.val());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true });
  }
});

app.get("/", (req, res) => {
  res.send("Firebase Server OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server đang chạy trên port " + PORT));
