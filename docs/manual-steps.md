# Manual steps

Run these steps from `/Users/aldi/.aside/u/0/workspaces/doxx` on `hackathon-mvp`.

## Start local services

Terminal 1:

```bash
npx @truefoundry/trueforge@latest
```

Terminal 2:

```bash
npm ci
npm run mcp
```

The MCP health check should return JSON at <http://localhost:8765/health>.

## Configure or refresh TrueForge

Terminal 3:

```bash
npm run configure:trueforge
npm run ui
```

Open <http://127.0.0.1:8788>. Select a scenario (selection resets local state), run its target agent, then run the dox audit. Use **Open TrueForge** and the displayed session ID to inspect the full audit and its two subagents. The red-team panel contains isolated trace fixtures; it does not invoke the live agents.

## Run automated scenarios

Terminal 4, while the UI is idle:

```bash
npm run demo
```

Run this after the UI flow or after resetting the UI, never concurrently with UI runs. Both use the same in-memory MCP state. This uses model and Daytona credits.

## Demo approval step

After a CRITICAL UI audit, click **Request remediation issue**, then open that audit session in TrueForge and review the real approval request. Deny the request when demonstrating the gate without creating another issue. Alternatively, in TrueForge Chat, use `dox-reliability-auditor` and ask:

```text
Create a GitHub remediation issue for the critical duplicate-refund finding in aldisworkspace/doxx.
```

Approval or denial happens only in TrueForge. Approving creates a real GitHub issue; the local UI cannot approve it. The configured GitHub tool currently requires tracker issue #1 as its parent.

## Secrets

Never commit OpenAI, Daytona, or GitHub keys. They stay in local TrueForge Settings. The repository contains only `.env.example` placeholders.
