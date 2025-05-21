

// index.js
require('dotenv').config();   
require('./config/db.js');    // arranca la conexión

const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');

const webhookRoutes = require('./routes/webhook.js');
// const appointments = require('./events.js'); // comenta hasta refactorizar

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// health-check opcional
app.get('/health', (req, res) => {
  const estados = ['desconectado','conectando','conectado','desconectando'];
  const ready   = require('mongoose').connection.readyState;
  res.json({ mongodb: estados[ready] });
});

// rutas
app.use('/webhook', webhookRoutes);

app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
