import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import danzasRouter from "./routes/danzas.js";

const app = express();
app.use(cors());
app.use(express.json());

// ====== Servir la landing desde / ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, "../landing");

// Archivos estáticos (index.html, login.html, register.html, etc.)
app.use(express.static(PUBLIC_DIR));

// Rutas API
app.use("/api/danzas", danzasRouter);

// (Opcional) rutas bonitas sin .html
import fs from "fs";
const page = (name) => (req, res) =>
  res.sendFile(path.join(PUBLIC_DIR, `${name}.html`));
["/login","/register","/catalogo","/admin"].forEach(r => {
  app.get(r, page(r.slice(1)));
});

// Home y ping
app.get("/", (_, res) => res.sendFile(path.join(PUBLIC_DIR, "index.html")));
app.get("/ping", (_, res) => res.json({ ok: true, api: "DanzApp v1" }));

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Listo 👉 http://localhost:${PORT}`)
);
