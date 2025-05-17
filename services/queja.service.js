// services/queja.service.js
const Queja = require("../models/Queja");
exports.create = data => Queja.create(data);
