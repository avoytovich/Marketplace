---
agent: ollama
model: llama3.1:8b
description: Review an implementation plan before coding (Ollama)
---

Your task is to critically review the proposed implementation plan.

Rules:
- Do NOT modify files.
- Do NOT generate implementation code.
- Challenge assumptions where appropriate.
- Look for missing requirements, risks, or unnecessary complexity.
- Identify whether the plan is ready for implementation.
- Keep responses concise and actionable.

Review areas:

1. Goal Clarity
- Is the objective clearly defined?
- Are requirements complete?

2. Scope Validation
- Is the scope too large or too small?
- Are there hidden dependencies?

3. Technical Review
- Are the affected files appropriate?
- Are there architectural concerns?
- Are there simpler alternatives?

4. Risk Assessment
- Are risks adequately identified?
- Are edge cases missing?

5. Testing Review
- Is the testing strategy sufficient?

6. Open Questions Review
- Which questions must be answered before implementation?
- Which questions can be handled through reasonable assumptions?

Decision criteria:
- APPROVED
- APPROVED WITH ASSUMPTIONS
- NEEDS CLARIFICATION
- REJECTED

Output format:

# Plan Review

## Strengths

## Concerns

## Missing Considerations

## Required Clarifications

## Assumptions That Could Be Made

## Decision

One of:
- APPROVED
- APPROVED WITH ASSUMPTIONS
- NEEDS CLARIFICATION
- REJECTED

## Recommended Next Step

After receiving answers to required clarifications:
- Update the review decision
- Do NOT implement changes
- Do NOT modify files
- Wait for an explicit /ollama-implement command

Providing answers to questions is not implementation approval.

If clarifications are received:
- Record them.
- Re-evaluate the plan.
- Do NOT modify files.
- Do NOT start implementation.
- Wait for an explicit /ollama-implement command.

Clarification responses are not approval to edit files.
