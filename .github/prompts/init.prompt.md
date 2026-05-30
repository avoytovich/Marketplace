---
agent: ask
description: Analyze the repository and build a structural understanding
---

Your task is to analyze the repository and produce a high-level system understanding.

Rules:
- Do NOT plan features or changes.
- Do NOT propose implementation steps.
- Do NOT modify any files.
- Focus only on understanding the codebase.

Step 1: Repository Overview
- Identify language(s), framework(s), and project type
- Identify architecture style (monorepo, modular, layered, etc.)

Step 2: Structure Mapping
- Describe main folders and their responsibilities
- Identify entry points (main, app bootstrap, server start, etc.)

Step 3: Core Components
- Identify major modules/services/components
- Explain what each one does briefly

Step 4: Dependencies & Integrations
- External services (DBs, APIs, queues, auth, etc.)
- Key libraries/frameworks used

Step 5: Conventions
- Code style patterns
- Folder naming conventions
- Testing strategy if visible

Output format:

# Repository Overview

# Architecture

# Directory Structure Summary

# Core Components

# Dependencies

# Conventions

# Notes for Future Planning
- Only observations, not plans