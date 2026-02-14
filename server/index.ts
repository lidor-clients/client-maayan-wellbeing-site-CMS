// index.ts
import express from "express";
import cors from "cors";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(__dirname, "uploads");

// ===== CONFIG =====
const CMS_PASSWORD = process.env.CMS_PASSWORD;
if (!CMS_PASSWORD) {
  throw new Error("CMS_PASSWORD is missing. Set it in .env or Render env vars.");
}

const DEBUG_AUTH = process.env.DEBUG_AUTH === "1";

// ===== SIMPLE LOGGER =====
function log(event: string, details: Record<string, unknown> = {}) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${event}`, details);
}

function maskToken(token: string | null) {
  if (!token) return null;
  if (token.length <= 10) return "***";
  return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

// ===== SESSIONS =====
const activeSessions = new Set<string>();

// ===== ENSURE DIRS =====
for (const dir of [DATA_DIR, UPLOADS_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ===== MULTER =====
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/__health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Serve uploads
app.use("/uploads", express.static(UPLOADS_DIR));

// ===== HELPERS =====
function getBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header) return null;
  const m = header.match(/^Bearer\s+(.+)$/i);
  return m ? m[1] : null;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getBearerToken(req);

  if (!token || !activeSessions.has(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}

// ===== CONTENT CONFIG =====
const VALID_SECTIONS = [
  "navbar",
  "hero",
  "about",
  "services",
  "workshop",
  "leadMagnets",
  "newsletter",
  "footer",
] as const;

function isValidSection(section: string): section is (typeof VALID_SECTIONS)[number] {
  return (VALID_SECTIONS as readonly string[]).includes(section);
}

function safeReadJson(filePath: string): unknown | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

// ===== AUTH ROUTES =====
app.post("/api/auth/login", (req, res) => {
  const password = String(req.body?.password ?? "");

  if (password !== CMS_PASSWORD) {
    res.status(401).json({ error: "סיסמה שגויה" });
    return;
  }

  const token = crypto.randomUUID();
  activeSessions.add(token);

  res.json({ token });
});

app.post("/api/auth/logout", (req, res) => {
  const token = getBearerToken(req);
  if (token) activeSessions.delete(token);
  res.json({ success: true });
});

app.post("/api/auth/verify", (req, res) => {
  const token = getBearerToken(req);
  const valid = Boolean(token && activeSessions.has(token));
  res.json({ valid });
});

// ===== CONTENT ROUTES =====
app.get("/api/content", (_req, res) => {
  const content: Record<string, unknown> = {};
  for (const section of VALID_SECTIONS) {
    const filePath = path.join(DATA_DIR, `${section}.json`);
    const data = safeReadJson(filePath);
    if (data !== null) content[section] = data;
  }
  res.json(content);
});

app.get(
  "/api/content/:section",
  (req: Request<{ section: string }>, res: Response) => {
    const section = req.params.section;

    if (!isValidSection(section)) {
      res.status(404).json({ error: "Section not found" });
      return;
    }

    const filePath = path.join(DATA_DIR, `${section}.json`);
    const data = safeReadJson(filePath);

    if (data === null) {
      res.status(404).json({ error: "Section data not found" });
      return;
    }

    res.json(data);
  }
);

app.put(
  "/api/content/:section",
  requireAuth,
  (req: Request<{ section: string }>, res: Response) => {
    const section = req.params.section;

    if (!isValidSection(section)) {
      res.status(404).json({ error: "Section not found" });
      return;
    }

    const filePath = path.join(DATA_DIR, `${section}.json`);
    fs.writeFileSync(filePath, JSON.stringify(req.body ?? {}, null, 2), "utf-8");

    res.json({ success: true });
  }
);

// ===== UPLOAD =====
app.post("/api/upload", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  res.json({ url: `/uploads/${req.file.filename}` });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("UNHANDLED_ERROR", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ===== PRODUCTION STATIC =====
if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "..", "dist");
  app.use(express.static(clientDist));

  app.get("/*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// ===== START =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
