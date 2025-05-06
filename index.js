require('dotenv').config();
const webhookRoutes = require("./routes/webhook");


const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose"); // 🔥 Esta línea es necesaria
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI;
const verify_token = process.env.VERIFY_TOKEN;


app.use("/webhook", webhookRoutes);



// Conexión a MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// Modelo de Queja externo en folder models
const Queja = require("./models/Queja");

// Endpoint para recibir quejas
app.post("/api/quejas", async (req, res) => {
  const { numero, mensaje, fecha } = req.body;

  try {
    const nuevaQueja = new Queja({ numero, mensaje, fecha });
    await nuevaQueja.save();
    res.status(201).json({ mensaje: "Queja guardada en base de datos" });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar la queja" });
  }
});

app.get("/api/quejas", async (req, res) => {
  try {
    const quejas = await Queja.find(); // Busca todas las quejas en la colección
    res.status(200).json(quejas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las quejas" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


