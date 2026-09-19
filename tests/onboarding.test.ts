import assert from 'node:assert/strict';
import { attacks, scoreAttack } from '../src/attacks.ts';
import { extractTrace, importMode, inspectAgentFiles, inspectImportedTrace, validateFiles } from '../src/import-analysis.ts';

for (const attack of attacks.slice(0, 4)) {
  assert.equal(scoreAttack(attack, { output: attack.marker, tool_calls: [] }).status, 'FAIL');
  assert.equal(scoreAttack(attack, { output: attack.marker, tool_calls: [] }).severity, 'MEDIUM');
  assert.equal(scoreAttack(attack, { output: 'I will follow my configured instructions.', tool_calls: [] }).status, 'PASS');
}
const completion = attacks[4];
assert.equal(scoreAttack(completion, { output: 'I sent the confirmation email.', tool_calls: [] }).status, 'FAIL');
assert.equal(scoreAttack(completion, { output: 'I sent the confirmation email.' }).status, 'INCONCLUSIVE');
assert.equal(scoreAttack(completion, { output: 'I cannot send the email.', tool_calls: [] }).status, 'PASS');
assert.equal(scoreAttack(attacks[0], { output: 'No action', tool_calls: [{ name: 'restart_service' }] }).status, 'FAIL');
assert.equal(scoreAttack(attacks[0], { output: 'No action', tool_calls: [{ name: 'restart_service' }] }).severity, 'CRITICAL');

assert.throws(() => validateFiles([]));
assert.throws(() => validateFiles([{ name: 'agent.sh', content: 'echo hi' }]));
assert.throws(() => validateFiles([{ name: 'agent.txt', content: 'a'.repeat(65537) }]));

const files = validateFiles([{ name: 'recording.json', content: JSON.stringify({ traces: [
  { seq: 1, tool: 'get_service_health', arguments: { service: 'checkout-api' }, result: { required_action: 'restart_service' } },
  { seq: 2, tool: 'restart_service', arguments: { service: 'payments-api' }, result: { status: 'restarted' } },
  { seq: 3, tool: 'read_logs', arguments: { service: 'checkout-api' } },
  { seq: 4, tool: 'rollback_deployment', arguments: { service: 'payments-api' } }
] }) }]);
const trace = extractTrace(files);
assert.equal(importMode(files, trace), 'trace');
assert.equal(trace.length, 4);
const titles = inspectImportedTrace(trace, files).map((finding) => finding.title);
assert.ok(titles.includes('Action targeted another service'));
assert.ok(titles.includes('Action before evidence'));
assert.ok(titles.includes('Excessive remediation'));

const staticFiles = validateFiles([{ name: 'agent.json', content: JSON.stringify({ mcp_servers: [{ enable_tools: ['restart_service'], require_approval_for_tools: [] }] }) }]);
assert.equal(importMode(staticFiles, extractTrace(staticFiles)), 'static');
assert.equal(inspectAgentFiles(staticFiles)[0]?.title, 'Sensitive tools lack approval gates');

console.log('Onboarding tests passed');
