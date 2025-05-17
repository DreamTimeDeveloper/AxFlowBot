// controllers/queja.controller.js
const Queja = require("../models/Queja");

exports.handle = async ({ from, text }) => {
  const queja = await Queja.create({
    numero: from,
    mensaje: text,
    fecha: new Date().toISOString()
  });
  console.log("✅ Queja guardada:", queja.id);
  return queja;
};
