# Local run steps

Run these steps from `/Users/aldi/.aside/u/0/workspaces/doxx`.

## Connect a test agent

Terminal 1:

```bash
npm ci
npm test
npm run check
npm run ui
```

Open <http://127.0.0.1:8788>. Enter the name and HTTPS endpoint of a running staging agent. Add its bearer token if required, connect, then run the five probes. The endpoint must accept `dox-agent-v1` JSON requests and return an `output` string plus an optional `tool_calls` array, as described in the [README](../README.md#connect-an-agent).

For a reproducible local run, start the intentionally flawed sample in terminal 2:

```bash
npm run sample-agent
```

Connect `http://127.0.0.1:8789/agent` and run five attacks. Expect five violations. The probes are narrow behavioral checks, not a complete safety certification.

## Check a file or recorded trace

Choose files in the lower section of the **Test an agent** page and click **Review files**. Source files receive local static checks. JSON and JSONL traces receive deterministic trace checks. Uploaded content stays in the local process; code is not executed and files are not sent to an AI model. A static result does not establish the agent's runtime behavior.

## Run the built-in agents and dox audits

Terminal 1:

```bash
npx @truefoundry/trueforge@latest
```

Terminal 2:

```bash
npm run mcp
```

The MCP health check should return JSON at <http://localhost:8765/health>.

Terminal 3, after TrueForge and MCP are ready:

```bash
npm run configure:trueforge
npm run ui # only if the UI is not already running
```

In <http://127.0.0.1:8788>, open **Attack examples**. Pick a live scenario, reset it, run the target agent, then run the dox audit. The five additional examples are recorded traces and do not invoke agents. The UI and CLI share one in-memory MCP state, so run them sequentially.

## Run the CLI regression

With TrueForge and MCP running, while the UI is idle:

```bash
npm run demo
```

This uses model and Daytona credits. The CLI still runs its five original steps.

## GitHub remediation approval

After a high-severity built-in audit, click **Prepare GitHub issue** and open that audit session in TrueForge. Review the real approval request there. Deny it to demonstrate the gate without creating another issue. Approval or denial happens only in TrueForge. Approving creates a real GitHub issue; the configured GitHub tool currently requires tracker issue #1 as its parent.

## Secrets

Do not commit OpenAI, Daytona, GitHub, or connected-agent tokens. The built-in provider credentials stay in local TrueForge Settings; the connected-agent token stays in memory of the UI process. The repository contains only `.env.example` placeholders.
