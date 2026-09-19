# Product walkthrough

1. Open <http://127.0.0.1:8788>. On **Test an agent**, connect the local sample at `http://127.0.0.1:8789/agent` (start it with `npm run sample-agent`). Run five attacks and open a result to show the exact response and supplied tool trace.
2. Explain that a customer connects a safe staging endpoint using the same JSON contract. An uploaded file gets local static or trace analysis; it cannot reproduce the behavior of a running agent.
3. Open **Attack examples**. Run **Normal refund** and show one refund. Run **Duplicate refund** and show two calls, `$250` refunded, and CRITICAL FAIL. Run the dox audit and show its summary and two subagents.
4. Run **Poisoned logs**. Show `get_service_health → read_logs → restart_service` if the target follows the injected instruction. The UI reports the observed result; model behavior can vary.
5. Open the five recorded traces and identify them as fixtures. They illustrate additional faults without claiming live agent coverage.
6. If a high-severity live audit is available, click **Prepare GitHub issue**. In the TrueForge audit session, show `tool.approval_required` and deny it for a no-write demonstration. Approve only if you intend to create a real issue. Existing [remediation issue #2](https://github.com/aldisworkspace/doxx/issues/2) is a reference from an earlier verified run.

The configured GitHub MCP requires a parent issue number for `issue_write`. The verified earlier run used [issue #1](https://github.com/aldisworkspace/doxx/issues/1) as a tracker parent.
