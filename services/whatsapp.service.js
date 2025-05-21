
// Tu token de acceso y el ID de tu número de WhatsApp Cloud API
const TOKEN    = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

/**
 * Envia un mensaje de texto al usuario.
 * @param {string} to         - Número en formato E.164, p.ej. "5215551234567"
 * @param {string} bodyText   - El texto que quieres enviar
 */
async function sendText(to, bodyText) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    text: { body: bodyText },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`WhatsApp sendText error ${res.status}: ${errorText}`);
  }

  return res.json();
}

/**
 * Envía un mensaje interactivo con botones al usuario.
 * Los botones disparan reply.id "ENVIAR_QUEJA" o "AGENDAR_CITA".
 * @param {string} to - Número en formato E.164
 */
async function sendButton(to) {
  const url = `https://graph.facebook.com/v17.0/${PHONE_ID}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",          // ← aquí
    interactive: {
      type: "button",
      body: { text: "¿Qué acción deseas realizar?" },
      action: {
        buttons: [
          { type: "reply", reply: { id: "ENVIAR_QUEJA",  title: "📝 Enviar Queja" } },
          { type: "reply", reply: { id: "AGENDAR_CITA", title: "📅 Agendar Cita" } }
        ]
      }
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`WhatsApp sendButton error ${res.status}: ${errorText}`);
  }

  return res.json();
}


module.exports = { sendText, sendButton };
