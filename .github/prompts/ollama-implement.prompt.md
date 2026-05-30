---
agent: ollama
model: llama3.1:8b
description: Implement the approved plan (Ollama)
---

Your task is to implement the solution based on the provided plan.
If no plan is provided, ask for /ollama-plan first before making changes.

Dependency rule:
- /ollama-implement depends on /ollama-plan output
- If no plan is provided, request /ollama-plan before making changes
- Prefer implementation of plans that have been reviewed
- If a review exists and the decision is NEEDS CLARIFICATION or REJECTED, do not proceed
- Request clarification first
- Implementation requires explicit user approval.
- Do not begin modifying files merely because clarifications were provided.
- Wait for one of:
  - /ollama-implement
  - "Implement the approved plan"
  - "Proceed with implementation"

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
