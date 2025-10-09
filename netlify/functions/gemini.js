// Wrapper to re-export the handler from the nested implementation.
// Keeps implementation in netlify/functions/gemini/gemini.js while making
// the function available at /.netlify/functions/gemini
try {
  const mod = require('./gemini/gemini.js');
  if (mod && typeof mod.handler === 'function') {
    // Wrap handler to add an invocation log (helps debugging in netlify dev)
    exports.handler = async (event, context) => {
      console.log('Outer gemini wrapper invoked - path:', event.path || event.rawUrl || 'unknown');
      return mod.handler(event, context);
    };
  } else if (typeof mod === 'function') {
    // support default export
    exports.handler = async (event, context) => {
      console.log('Outer gemini wrapper invoked - path:', event.path || event.rawUrl || 'unknown');
      return mod(event, context);
    };
  } else {
    throw new Error('Nested gemini module does not export a handler');
  }
} catch (err) {
  // If require fails (e.g., during build), export a handler that returns 500
  console.error('Failed to load nested gemini function:', err);
  exports.handler = async () => ({ statusCode: 500, body: JSON.stringify({ error: 'Function load error' }) });
}
