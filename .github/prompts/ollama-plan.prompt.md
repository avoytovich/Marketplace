---
agent: ollama
model: llama3.1:8b
description: Create an implementation plan using repository context (Ollama)
---

Before starting:
- If repository context from `/ollama-init` exists, use it as primary understanding
- Only analyze additional files if necessary for the task
- Do NOT re-scan the entire repository unless required

Your task is to create a detailed implementation plan.
Do not ask whether to proceed with implementation,
diagnostics, installation, or setup.

Your responsibility is to create a plan only.

Dependency rule:
- Prefer using /ollama-init output if available
- If /ollama-init has not been run, perform targeted analysis of the repository

Efficiency rule:
- Prefer reuse of existing repository understanding
- Perform targeted analysis only on relevant modules

Rules:
- Do not perform full repository analysis unless /ollama-init was not run or context is missing
- Do NOT modify any files.
- Do NOT generate code unless explicitly requested.
- Keep responses concise and focused.
- First analyze the repository structure and relevant files.
- Identify affected components.
- Identify risks and assumptions.

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

Only include questions that materially affect implementation,
architecture, dependencies, user experience, security,
or project scope.

## UI Output (for Search with AI Assistant)

- Provide a compact UI-friendly representation suitable for rendering after the user clicks "Search with AI Assistant".
- Output a short one-line summary (max 20 words), then a small table limited to at most 3 columns showing the most important items (e.g., Component | Change | Risk).
- Produce both a Markdown table and an equivalent small HTML snippet with inline styles for high-contrast rendering. Use bold headers and inline styles to increase contrast (e.g., `style="background:#111111;color:#FFFFFF;padding:6px;text-align:left;"`).
- Keep the table compact: maximum 6 rows and maximum 3 columns. If there are more items, provide the top 6 and note "(truncated)".
- Also include a short plain-text checklist (3 bullets) that the UI can render as action items.
- Do not include large code blocks or full diffs in the table; list file paths instead.
