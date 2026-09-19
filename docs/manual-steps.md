# Manual steps

These are the only steps that need a human terminal or account interaction after cloning.

## Start local services

Terminal 1:

```bash
npx @truefoundry/trueforge@latest
```

Terminal 2:

```bash
npm install
npm run mcp
```

The MCP health check should return JSON at <http://localhost:8765/health>.

## Configure or refresh TrueForge

Terminal 3:

```bash
npm run configure:trueforge
```

## Run automated scenarios

```bash
npm run demo
```

This uses model and Daytona credits.

## Demo approval step

In TrueForge Chat, use `dox-reliability-auditor` and ask:

```text
Create a GitHub remediation issue for the critical duplicate-refund finding in aldisworkspace/doxx.
```

Review the real TrueForge approval card and click Approve. This step is intentionally manual because it demonstrates human control.

## Secrets

Never commit OpenAI, Daytona, or GitHub keys. They stay in local TrueForge Settings. The repository contains only `.env.example` placeholders.
