// routes/webhook.js
const express = require("express");
const router  = express.Router();
const quejaCtrl = require("../controllers/queja.controller");
const citaCtrl  = require("../controllers/cita.controller");
const VERIFY = process.env.VERIFY_TOKEN || "axflow_verify_token_2025";




//GET
router.get("/", (req, res) => {
  const { "hub.mode": mode, "hub.verify_token": token, "hub.challenge": chal } = req.query;
  if (mode === "subscribe" && token === VERIFY) {
    console.log("🟢 Webhook verificado con Meta");
    return res.send(chal);
  }
  return res.sendStatus(403);
});
//POST

router.post("/", async (req, res) => {
  console.log("📩 Webhook recibido:", JSON.stringify(req.body, null, 2));
  const messages = req.body.entry?.[0]?.changes?.[0]?.value?.messages || [];
  for (const m of messages) {
    const from = `whatsapp:${m.from}`;
    const text = m.text?.body?.trim() || "";
    try {
      if (text.toLowerCase().startsWith("cita")) {
        await citaCtrl.handle({ from, text });
      } else {
        await quejaCtrl.handle({ from, text });
      }
    } catch (err) {
      console.error("❌ Error manejando mensaje:", err);
    }
  }
  res.sendStatus(200);
});

module.exports = router;
