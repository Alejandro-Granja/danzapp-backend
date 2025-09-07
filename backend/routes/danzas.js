import { Router } from "express";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "../data/danzas.json");

// Helpers de “persistencia”
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// CREATE
router.post("/", (req, res) => {
  const { nombre, region, descripcion = "", origen = "", imagenUrl = "", videoUrl = "" } = req.body;
  if (!nombre || !region) return res.status(400).json({ error: "nombre y region son obligatorios" });

  const danzas = readDB();
  const nuevo = {
    id: randomUUID(),
    nombre, region, descripcion, origen, imagenUrl, videoUrl,
    fechaRegistro: new Date().toISOString()
  };
  danzas.push(nuevo);
  writeDB(danzas);
  res.status(201).json(nuevo);
});

// READ (todos)
router.get("/", (_, res) => res.json(readDB()));

// READ (por id)
router.get("/:id", (req, res) => {
  const item = readDB().find(d => d.id === req.params.id);
  if (!item) return res.status(404).json({ error: "No encontrada" });
  res.json(item);
});

// UPDATE
router.put("/:id", (req, res) => {
  const danzas = readDB();
  const idx = danzas.findIndex(d => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "No encontrada" });
  danzas[idx] = { ...danzas[idx], ...req.body };
  writeDB(danzas);
  res.json(danzas[idx]);
});

// DELETE
router.delete("/:id", (req, res) => {
  const danzas = readDB();
  const nueva = danzas.filter(d => d.id !== req.params.id);
  if (nueva.length === danzas.length) return res.status(404).json({ error: "No encontrada" });
  writeDB(nueva);
  res.status(204).send();
});

export default router;
