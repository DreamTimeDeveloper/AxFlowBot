// controllers/cita.controller.js
const Cita = require("../models/Cita");
const { appointments } = require("../index");

exports.handle = async ({ from, text }) => {
  // "cita 2025-08-01 10:00 Corte Juanita"
  const [_, fecha, hora, ...rest] = text.split(" ");
  const servicio = rest.join(" ");
  const cita = await Cita.create({
    numero: from,
    fechaHora: `${fecha} ${hora}`,
    servicio
  });
  appointments.emit("new_appointment", cita);
  console.log("📅 Cita creada:", cita.id);
  return cita;
};
