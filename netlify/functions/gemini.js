// Wrapper to re-export the handler from the nested implementation.
// Keeps implementation in netlify/functions/gemini/gemini.js while making
// the function available at /.netlify/functions/gemini
try {
  const mod = require('./gemini/gemini.js');
  if (mod && typeof mod.handler === 'function') {
    exports.handler = mod.handler;
  } else if (typeof mod === 'function') {
    // support default export
    exports.handler = mod;
  } else {
    throw new Error('Nested gemini module does not export a handler');
  }
} catch (err) {
  // If require fails (e.g., during build), export a handler that returns 500
  console.error('Failed to load nested gemini function:', err);
  exports.handler = async () => ({ statusCode: 500, body: JSON.stringify({ error: 'Function load error' }) });
}
