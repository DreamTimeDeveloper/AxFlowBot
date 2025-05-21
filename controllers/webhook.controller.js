// controllers/webhook.controller.js
import { handle as guardarQueja } from './queja.controller.js';
import { handle as agendarCita }    from './cita.controller.js';
import { sendText, sendButton }     from '../services/whatsapp.service.js';

const estados = {}; // demo

function extractMessage(body) {
  const entry  = body.entry?.[0];
  const change = entry?.changes?.[0];
  return change?.value?.messages?.[0] || null;
}






export function verify(req, res) {

  console.log('--- verify webhook ---', {
    mode: req.query['hub.mode'],
    token: req.query['hub.verify_token'],
    challenge: req.query['hub.challenge'],
    expected: process.env.VERIFY_TOKEN
  });
  
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const VERIFY    = process.env.VERIFY_TOKEN;

  if (mode === 'subscribe' && token === VERIFY) {
    console.log('🟢 Webhook verificado con Meta');
    return res.status(200).send(challenge);
  }
  console.warn('❌ Verificación fallida');
  return res.sendStatus(403);
}

export async function receive(req, res, next) {
  try {
    const msg = extractMessage(req.body);
    if (!msg) return res.sendStatus(404);

    const from    = msg.from;
    const text    = msg.text?.body;
    const replyId = msg.button?.reply?.id;

    if (!estados[from] && !replyId) {
      estados[from] = null;
      await sendButton(from);
      return res.sendStatus(200);
    }

    if (replyId === 'ENVIAR_QUEJA') {
      estados[from] = 'PENDIENTE_QUEJA';
      await sendText(from, '✍️ Escribe tu queja.');
      return res.sendStatus(200);
    }

    if (replyId === 'AGENDAR_CITA') {
      estados[from] = 'PENDIENTE_CITA';
      await sendText(from, '📅 Dime día y hora.');
      return res.sendStatus(200);
    }

    if (estados[from] === 'PENDIENTE_QUEJA') {
      await guardarQueja({ from, text });
      await sendText(from, '✅ Queja guardada.');
      estados[from] = null;
      return res.sendStatus(200);
    }

    if (estados[from] === 'PENDIENTE_CITA') {
      await agendarCita({ from, text });
      await sendText(from, '✅ Cita agendada.');
      estados[from] = null;
      return res.sendStatus(200);
    }

    await sendButton(from);
    return res.sendStatus(200);

  } catch (err) {
    console.error('❌ Error en receive:', err);
    next(err);
  }
}
