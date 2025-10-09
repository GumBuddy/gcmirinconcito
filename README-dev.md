Development notes — local setup

1) Install Netlify CLI (if you want to run functions locally):

   npm install -g netlify-cli

2) Create a local .env from the included example:

   cp .env.example .env
   # Then open .env and replace GEMINI_API_KEY with your real key. Do NOT commit .env.

3) Install function dependencies (optional but recommended):

   cd netlify/functions
   npm install

4) Start the local dev server:

   # From the project root
   netlify dev

5) Security note:
   - Never commit your real API keys. Use environment variables in Netlify (Site settings > Functions > Environment variables) for production.

If you want, I can add helper scripts or automate env loading. Let me know.