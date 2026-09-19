import { readFile } from 'node:fs/promises';

const base = process.env.TRUEFORGE_BASE_URL ?? 'http://localhost:8790';
const repo = 'https://github.com/aldisworkspace/doxx';

async function request(path: string, init: RequestInit = {}) {
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers ?? {}) }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${init.method ?? 'GET'} ${path}: ${response.status} ${JSON.stringify(body)}`);
  return body;
}

async function upsertConnector() {
  const manifest = {
    type: 'remote',
    name: 'dox-demo',
    url: process.env.DOX_MCP_URL ?? 'http://localhost:8765/mcp',
    description: 'Controlled Brittle and Rogue tools, fault injection, trace capture, and deterministic evaluation for dox.'
  };
  const existing = await request('/api/v1/settings/mcp-servers');
  const found = existing.data.find((item: { name: string }) => item.name === manifest.name);
  await request(found ? `/api/v1/settings/mcp-servers/${manifest.name}` : '/api/v1/settings/mcp-servers', {
    method: found ? 'PUT' : 'POST',
    body: JSON.stringify({ manifest })
  });
}

async function upsertSkill(name: string, path: string, description: string) {
  const manifest = { type: 'git', name, url: repo, path, ref: 'hackathon-mvp', description };
  const existing = await request('/api/v1/settings/skills');
  const found = existing.data.find((item: { name: string }) => item.name === name);
  await request(found ? `/api/v1/settings/skills/${name}` : '/api/v1/settings/skills', {
    method: found ? 'PUT' : 'POST',
    body: JSON.stringify({ manifest })
  });
}

async function upsertAgent(name: string, description: string, manifest: unknown) {
  const existing = await request('/api/v1/agents');
  const found = existing.data.find((item: { name: string }) => item.name === name);
  if (found) {
    await request(`/api/v1/agents/${found.id}`, {
      method: 'PUT',
      body: JSON.stringify({ description, manifest })
    });
  } else {
    await request('/api/v1/agents', {
      method: 'POST',
      body: JSON.stringify({ name, description, manifest })
    });
  }
}

const doxInstructions = await readFile(new URL('../agents/dox.instructions.md', import.meta.url), 'utf8');
const brittleInstructions = await readFile(new URL('../agents/brittle.instructions.md', import.meta.url), 'utf8');
const rogueInstructions = await readFile(new URL('../agents/rogue.instructions.md', import.meta.url), 'utf8');

await upsertConnector();
await upsertSkill(
  'dox-agent-audit',
  'skills/agent-audit',
  'Audit agent traces for tools, side effects, retries, timeouts, duplicate actions, partial failures, and false success claims.'
);
await upsertSkill(
  'dox-security-remediation',
  'skills/security-remediation',
  'Test prompt injection, malicious tool content, permissions and approval bypass, then produce evidence-backed remediation.'
);

await upsertAgent('brittle-refund-agent', 'Intentionally brittle refund agent for controlled reliability testing.', {
  model: { name: 'openai/gpt-5-4-mini', params: { reasoning_effort: 'low', parallel_tool_calls: false } },
  instructions: brittleInstructions,
  mcp_servers: [{
    name: 'dox-demo',
    enable_tools: ['get_order', 'check_refund_policy', 'refund_payment', 'send_email'],
    require_approval_for_tools: [],
    preload: true
  }],
  config: {
    iteration_limit: 20,
    sandbox: { enabled: false, file_downloads: false },
    dynamic_sub_agents: { enabled: false },
    ask_user_questions: { enabled: false },
    context_management: { compaction: { enabled: true }, large_tool_response: { enabled: true } },
    generative_ui: { enabled: false },
    web_search: { enabled: false }
  }
});

await upsertAgent('rogue-operations-agent', 'Intentionally unsafe operations agent for controlled prompt-injection testing.', {
  model: { name: 'openai/gpt-5-4-mini', params: { reasoning_effort: 'low', parallel_tool_calls: false } },
  instructions: rogueInstructions,
  mcp_servers: [{
    name: 'dox-demo',
    enable_tools: ['get_service_health', 'read_logs', 'restart_service', 'rollback_deployment'],
    require_approval_for_tools: [],
    preload: true
  }],
  config: {
    iteration_limit: 20,
    sandbox: { enabled: false, file_downloads: false },
    dynamic_sub_agents: { enabled: false },
    ask_user_questions: { enabled: false },
    context_management: { compaction: { enabled: true }, large_tool_response: { enabled: true } },
    generative_ui: { enabled: false },
    web_search: { enabled: false }
  }
});

await upsertAgent('dox-reliability-auditor', 'Audits agent workflows under controlled failure and adversarial conditions, identifies unsafe behavior, and proposes remediation.', {
  model: { name: 'openai/gpt-5-5', params: { reasoning_effort: 'medium', parallel_tool_calls: true } },
  instructions: doxInstructions,
  mcp_servers: [
    {
      name: 'dox-demo',
      enable_tools: ['reset_demo', 'get_demo_state', 'get_execution_trace', 'evaluate_trace'],
      require_approval_for_tools: [],
      preload: true
    },
    {
      name: 'github',
      enable_tools: ['get_file_contents', 'list_branches', 'list_commits', 'issue_write'],
      require_approval_for_tools: ['issue_write'],
      preload: true
    }
  ],
  skills: [{ name: 'dox-agent-audit' }, { name: 'dox-security-remediation' }],
  response_format: { type: 'json_object' },
  config: {
    iteration_limit: 60,
    sandbox: { enabled: true, file_downloads: true },
    dynamic_sub_agents: { enabled: true },
    ask_user_questions: { enabled: true },
    context_management: { compaction: { enabled: true }, large_tool_response: { enabled: true } },
    generative_ui: { enabled: false },
    web_search: { enabled: false }
  }
});

console.log('TrueForge configured: dox-demo connector, two skills, and three agents.');
