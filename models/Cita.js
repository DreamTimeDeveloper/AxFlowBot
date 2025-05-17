// models/Cita.js
const mongoose = require("mongoose");

const citaSchema = new mongoose.Schema({
  numero:    { type: String, required: true },
  fechaHora: { type: String, required: true },
  servicio:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cita", citaSchema);