const mongoose = require("mongoose");

const schemaName = "Queja";

const QuejaSchema = new mongoose.Schema({
  numero: String,
  mensaje: String,
  fecha: String,
});

module.exports = mongoose.model(schemaName, QuejaSchema);
