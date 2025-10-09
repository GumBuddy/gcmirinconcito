// Use global fetch when available (Node 18+ / runtime), otherwise try to require node-fetch as a fallback.
let fetchLib = (typeof fetch === 'function') ? fetch : null;
if (!fetchLib) {
  try {
    // node-fetch v2 supports CommonJS require
    fetchLib = require('node-fetch');
  } catch (e) {
    console.warn('node-fetch not available and global fetch is undefined. Requests will fail unless node runtime provides fetch.');
  }
}

exports.handler = async (event, context) => {
  try {
    // Parsear el cuerpo de la solicitud
    const payload = JSON.parse(event.body || '{}');
    const userMessage = payload.userMessage || '';
    const systemContext = payload.context || '';

    // Log básico para debugging
    console.log('gemini function invoked - userMessage length:', (userMessage || '').length);

    // Obtener la API key de las variables de entorno de Netlify
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const body = { __error: 'API key no configurada', reply: 'Error: API key no configurada' };
      return { statusCode: 500, body: JSON.stringify(body) };
    }

    // URL de la API de Gemini
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    if (!fetchLib) {
      const body = { __error: 'No fetch implementation available in runtime', reply: 'Error interno: runtime no soporta fetch' };
      return { statusCode: 500, body: JSON.stringify(body) };
    }

    // Llamada a la API externa
    const response = await fetchLib(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemContext}\n\nPregunta del usuario: ${userMessage}` }] }]
      })
    });

    // Obtener texto crudo de la respuesta para diagnóstico
    const raw = await response.text();
    let parsed;
    try { parsed = raw ? JSON.parse(raw) : null; } catch (e) { parsed = null; }

    // Si la respuesta no es OK, devolver diagnóstico
    if (!response.ok) {
      console.error('Gemini API error', response.status, response.statusText, 'raw:', raw);
      const body = { __error: `Gemini API returned ${response.status}`, details: { status: response.status, statusText: response.statusText, raw: raw && raw.slice ? raw.slice(0, 2000) : raw }, reply: raw || 'Error externo' };
      return { statusCode: 502, body: JSON.stringify(body) };
    }

    // Extraer la respuesta del modelo (intento defensivo)
    let botResponse = null;
    try {
      if (parsed && parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content && parsed.candidates[0].content.parts && parsed.candidates[0].content.parts[0]) {
        botResponse = parsed.candidates[0].content.parts[0].text;
      }
    } catch (e) {
      console.warn('Could not extract candidate text from parsed response', e);
    }

    // Si no se pudo extraer, intenta usar raw como fallback
    if (!botResponse) {
      botResponse = raw || 'Lo siento, no hubo respuesta del modelo.';
    }

    // Responder siempre JSON con `reply` (y campo __debug cuando no estamos en producción)
    const result = { reply: botResponse };
    if (process.env.NODE_ENV !== 'production') {
      result.__debug = { raw: raw && raw.slice ? raw.slice(0, 2000) : raw };
    }
    return { statusCode: 200, body: JSON.stringify(result) };

  } catch (error) {
    console.error('Error en la función serverless:', error && error.stack || error);
    const body = { __error: 'Error interno del servidor', reply: 'Error interno del servidor', details: (error && error.message) ? error.message : String(error) };
    return { statusCode: 500, body: JSON.stringify(body) };
  }
};