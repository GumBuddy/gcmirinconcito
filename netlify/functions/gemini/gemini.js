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
    const { userMessage, context } = JSON.parse(event.body);
    
    // Obtener la API key de las variables de entorno de Netlify
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key no configurada' })
      };
    }
    
    // URL de la API de Gemini
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    // Realizar la solicitud a la API de Gemini
    if (!fetchLib) {
      throw new Error('No fetch implementation available in the function runtime. Install node-fetch or use a newer Node runtime with global fetch.');
    }

    const response = await fetchLib(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${context}\n\nPregunta del usuario: ${userMessage}`
              }
            ]
          }
        ]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    const botResponse = data.candidates[0].content.parts[0].text;
    
    // Devolver la respuesta
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: botResponse })
    };
    
  } catch (error) {
    console.error('Error en la función serverless:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor' })
    };
  }
};