const express = require("express");
const router = express.Router();
const Queja = require("../models/Queja"); // Ya definido en models
const verify_token = process.env.VERIFY_TOKEN || "axflow_verify_token";

// GET: Verificación de Meta
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verify_token) {
    console.log("🟢 Webhook verificado con Meta");
    return res.status(200).send(challenge);
  } else {
    return res.status(403).send("❌ Verificación fallida");
  }
});

// POST: Recepción de mensajes
router.post("/", async (req, res) => {
  const body = req.body;
  console.log("📩 Webhook recibido:", JSON.stringify(body, null, 2));

  if (body.object) {
    try {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const message = change?.value?.messages?.[0];

      if (message) {
        const numero = message.from;
        const mensaje = message.text?.body || "Sin texto";
        const fecha = new Date().toISOString();

        const nuevaQueja = new Queja({ numero, mensaje, fecha });
        await nuevaQueja.save();

        console.log("✅ Queja guardada en MongoDB");
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("❌ Error al guardar la queja:", error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
