import express from "express";
import cors from "cors";
import danzasRouter from "./routes/danzas.js";

const app = express();
app.use(cors());
app.use(express.json());

// Ping
app.get("/", (_, res) => res.json({ ok: true, api: "DanzApp v1" }));

// Rutas
app.use("/api/danzas", danzasRouter);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));
