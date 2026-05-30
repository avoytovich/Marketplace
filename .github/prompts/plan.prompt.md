---
agent: ask
description: Create an implementation plan using repository context and targeted analysis
---

Before starting:
- If repository context from `/init` exists, use it as primary understanding
- Only analyze additional files if necessary for the task
- Do NOT re-scan the entire repository unless required

Your task is to create a detailed implementation plan.
Do not ask whether to proceed with implementation,
diagnostics, installation, or setup.

Your responsibility is to create a plan only.

Dependency rule:
- Prefer using /init output if available
- If /init has not been run, perform targeted analysis of the repository

Efficiency rule:
- Prefer reuse of existing repository understanding
- Perform targeted analysis only on relevant modules

Rules:
- Do not perform full repository analysis unless /init was not run or context is missing
- Do NOT modify any files.
- Do NOT generate code unless explicitly requested.
- First analyze the repository structure and relevant files.
- Identify affected components.
- Identify risks and assumptions.
- Ask clarifying questions if requirements are ambiguous.

Output format:

# Goal

Brief summary of the requested feature.

# Current State

What exists today.

# Files Likely Affected

List files and explain why.

# Implementation Plan

1. Step one
2. Step two
3. Step three

# Risks

Potential issues and edge cases.

# Testing Strategy

Unit tests, integration tests, manual verification.

# Open Questions

Anything that needs clarification.

Only include questions that materially affect implementation,
architecture, dependencies, user experience, security,
or project scope.

Do not create questions merely because multiple valid
implementation approaches exist.

Open Questions should only include items that require
user decisions or business requirements clarification.

Do not ask operational next-step questions.