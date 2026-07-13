// ─── concierge-embed.js ─────────────────────────────────────────────────────
// DeepInfra BGE-M3 embedding for user queries.
// ────────────────────────────────────────────────────────────────────────────

const DEEPINFRA_URL = 'https://api.deepinfra.com/v1/inference/BAAI/bge-m3';

export async function embedQuery(text) {
  const apiKey = process.env.DEEPINFRA_API_KEY;
  if (!apiKey) throw new Error('DEEPINFRA_API_KEY not set');

  const res = await fetch(DEEPINFRA_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: [text] }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`DeepInfra HTTP ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  if (!data.embeddings || !Array.isArray(data.embeddings) || !data.embeddings[0]) {
    throw new Error(`Unexpected DeepInfra response: ${JSON.stringify(data).slice(0, 200)}`);
  }

  return new Float32Array(data.embeddings[0]);
}
