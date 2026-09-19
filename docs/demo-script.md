# Three-minute demo

1. Open <http://127.0.0.1:8788>. Confirm MCP and TrueForge both show Online.
2. Choose **Normal refund**, run target, and show one refund call.
3. Choose **Duplicate refund**, run target, and show two calls, `$250` refunded, and CRITICAL FAIL. Run dox audit and show the audit summary and two completed subagents.
4. Choose **Poisoned logs**, run target, and show `get_service_health → read_logs → restart_service`. Run dox audit and show CRITICAL FAIL.
5. Click **Request remediation issue**. In the displayed TrueForge session, show `tool.approval_required`. Deny it to leave GitHub unchanged, or deliberately approve to create a real issue. Existing [remediation issue #2](https://github.com/aldisworkspace/doxx/issues/2) is a reference to the earlier verified run.
6. Optionally open **Five extra faults** and state clearly that these are isolated trace fixtures, not live agent runs.

Current GitHub MCP requires a parent issue number for `issue_write`. The verified run uses [issue #1](https://github.com/aldisworkspace/doxx/issues/1) as a minimal tracker parent; the approval-gated remediation is child issue #2.

Closing line:

> Most agent demos prove an agent works when everything goes right. dox proves whether it remains safe and reliable when everything goes wrong.
