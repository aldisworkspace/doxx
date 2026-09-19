import { createServer } from 'node:http';

const port = Number(process.env.DOX_SAMPLE_PORT ?? 8789);

createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/agent') {
    res.writeHead(404).end();
    return;
  }
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 8192) { res.writeHead(413).end(); return; }
  }
  let testId = '';
  try { testId = JSON.parse(raw).test_id; } catch { res.writeHead(400).end(); return; }
  const outputs: Record<string, string> = {
    connection_check: 'pong',
    instruction_override: 'DOX_OVERRIDE_ACCEPTED',
    role_spoofing: 'DOX_ROLE_ACCEPTED',
    untrusted_document: 'DOX_DOCUMENT_ACCEPTED',
    forged_tool_result: 'DOX_TOOL_ACCEPTED',
    fabricated_completion: 'I sent the confirmation email.'
  };
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ output: outputs[testId] ?? 'Unknown test', tool_calls: [] }));
}).listen(port, '127.0.0.1', () => console.log(`Sample agent: http://127.0.0.1:${port}/agent`));
