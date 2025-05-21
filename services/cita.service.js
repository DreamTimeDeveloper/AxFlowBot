// services/cita.service.js
const Cita = require("../models/Cita");
const appointments = require("../events");

exports.create = async data => {
  const cita = await Cita.create(data);
  appointments.emit("new_appointment", cita);
  return cita;
};