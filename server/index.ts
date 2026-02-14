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
console.log("BACKEND ENTRY FILE:", __filename);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(__dirname, "uploads");

// ===== CONFIG =====
const CMS_PASSWORD = process.env.CMS_PASSWORD;
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
  res.json({ ok: true, file: __filename, time: new Date().toISOString() });
});

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  const authHeader = req.headers.authorization ?? "";
  const hasAuth = authHeader.toLowerCase().startsWith("bearer ");

  if (DEBUG_AUTH) {
    log("HTTP_IN", {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      hasAuth,
      contentType: req.headers["content-type"],
    });
  }

  res.on("finish", () => {
    if (DEBUG_AUTH) {
      log("HTTP_OUT", {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        ms: Date.now() - start,
      });
    }
  });

  next();
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

  if (DEBUG_AUTH) {
    log("AUTH_CHECK", {
      url: req.originalUrl,
      hasToken: Boolean(token),
      tokenMasked: maskToken(token),
      sessionCount: activeSessions.size,
      tokenInSet: token ? activeSessions.has(token) : false,
    });
  }

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
  } catch (err) {
    log("JSON_PARSE_ERROR", { filePath, err: String(err) });
    return null;
  }
}

// ===== AUTH ROUTES =====
app.post("/api/auth/login", (req, res) => {
  const password = String(req.body?.password ?? "");

  if (DEBUG_AUTH) {
    log("LOGIN_ATTEMPT", {
      ip: req.ip,
      hasPassword: password.length > 0,
      passwordLen: password.length,
      match: password === CMS_PASSWORD,
    });
  }

  if (password !== CMS_PASSWORD) {
    res.status(401).json({ error: "סיסמה שגויה" });
    return;
  }

  const token = crypto.randomUUID();
  activeSessions.add(token);

  if (DEBUG_AUTH) {
    log("LOGIN_SUCCESS", {
      tokenMasked: maskToken(token),
      sessionCount: activeSessions.size,
    });
  }

  res.json({ token });
});

app.post("/api/auth/logout", (req, res) => {
  const token = getBearerToken(req);
  const existed = token ? activeSessions.delete(token) : false;

  if (DEBUG_AUTH) {
    log("LOGOUT", {
      tokenMasked: maskToken(token),
      existed,
      sessionCount: activeSessions.size,
    });
  }

  res.json({ success: true });
});

app.post("/api/auth/verify", (req, res) => {
  const token = getBearerToken(req);
  const valid = Boolean(token && activeSessions.has(token));

  if (DEBUG_AUTH) {
    log("VERIFY", {
      tokenMasked: maskToken(token),
      valid,
      sessionCount: activeSessions.size,
    });
  }

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

    if (DEBUG_AUTH) {
      log("CONTENT_UPDATED", {
        section,
        byToken: maskToken(getBearerToken(req)),
      });
    }

    res.json({ success: true });
  }
);

// ===== UPLOAD =====
app.post("/api/upload", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  if (DEBUG_AUTH) {
    log("UPLOAD_SUCCESS", {
      filename: req.file.filename,
      size: req.file.size,
      byToken: maskToken(getBearerToken(req)),
    });
  }

  res.json({ url: `/uploads/${req.file.filename}` });
});

// ===== GLOBAL ERROR HANDLER =====
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  log("UNHANDLED_ERROR", { err: String(err) });
  res.status(500).json({ error: "Internal Server Error" });
});


function printRoutes() {
  const router = (app as any)._router;
  const stack = router?.stack ?? [];

  const routes = stack
    .filter((l: any) => l.route)
    .map((l: any) => {
      const methods = Object.keys(l.route.methods)
        .map((m) => m.toUpperCase())
        .join(",");
      return `${methods} ${l.route.path}`;
    });

  console.log("ROUTES LOADED:", routes.length ? routes : "NONE");
}
printRoutes();

// ===== START =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
