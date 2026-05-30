---
agent: agent
description: Implement the approved plan
---

Your task is to implement the solution based on the provided plan.
If no plan is provided, ask for /plan first before making changes.

Dependency rule:
- /implement depends on /plan output
- If no plan is provided, request /plan before making changes
- Prefer implementation of plans that have been reviewed
- If a review exists and the decision is NEEDS CLARIFICATION or REJECTED, do not proceed
- Request clarification first

Rules:
- Follow the implementation plan strictly
- Do not redesign architecture unless blocking issues are found
- Make minimal necessary changes
- Keep changes consistent with existing patterns
- Ensure code is production-quality

Before coding:
- Re-check relevant files only
- Validate assumptions from the plan

During implementation:
- Make small, incremental changes
- Preserve existing interfaces unless explicitly required to change them

After implementation:
- Ensure correctness
- Highlight any deviations from plan

Output format:

# Summary of Changes

# Files Modified

# Implementation Notes

# Deviations from Plan (if any)