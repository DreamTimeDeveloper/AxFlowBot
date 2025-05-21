// config/db.js
require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ Falta MONGO_URI o MONGODB_URI en .env');
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => console.log('✅ MongoDB conectada'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

module.exports = mongoose;
