# Ollama Prompts

This directory contains prompts designed to work with a locally running Ollama instance for AI-assisted development tasks.

## Overview

The Ollama prompts mirror the Copilot prompts structure, providing a local alternative using the `llama3.1:8b` model:

- **ollama-init.prompt.md** - Analyze the repository and build structural understanding
- **ollama-plan.prompt.md** - Create an implementation plan for a task
- **ollama-review-plan.prompt.md** - Review a proposed implementation plan
- **ollama-implement.prompt.md** - Implement an approved plan

## Quick Start

### Prerequisites

1. **Install Ollama**: Download from [ollama.ai](https://ollama.ai)
2. **Start Ollama**: Run `ollama serve` in a terminal
3. **Pull the model**: Run `ollama pull llama3.1:8b`

### Usage

From the repository root, use one of the CLI scripts:

**On Windows:**
```bash
.\ollama-prompts.bat init
.\ollama-prompts.bat plan "Add user authentication with JWT"
.\ollama-prompts.bat review-plan "your plan text here"
.\ollama-prompts.bat implement "your implementation context here"
```

**On macOS/Linux:**
```bash
./ollama-prompts.sh init
./ollama-prompts.sh plan "Add user authentication with JWT"
./ollama-prompts.sh review-plan "your plan text here"
./ollama-prompts.sh implement "your implementation context here"
```

## Prompt Descriptions

### /ollama-init
**Purpose**: Analyze the repository and build a structural understanding

Generates:
- Repository overview (language, framework, project type)
- Architecture style
- Folder structure and responsibilities
- Entry points
- Core components
- Dependencies and integrations
- Code conventions

### /ollama-plan
**Purpose**: Create an implementation plan for a task

Generates:
- Goal statement
- Current state analysis
- List of affected files
- Step-by-step implementation plan
- Risk assessment
- Testing strategy
- Open questions requiring clarification

### /ollama-review-plan
**Purpose**: Review a proposed implementation plan before coding

Evaluates:
- Goal clarity
- Scope validation
- Technical review
- Risk assessment
- Testing adequacy
- Decision (APPROVED, APPROVED WITH ASSUMPTIONS, NEEDS CLARIFICATION, REJECTED)

### /ollama-implement
**Purpose**: Implement an approved plan

Produces:
- Summary of changes
- List of modified files
- Implementation notes
- Any deviations from the original plan

## Workflow Example

```bash
# 1. Start with repository analysis
.\ollama-prompts.bat init

# 2. Create a plan for a new feature
.\ollama-prompts.bat plan "Add OAuth2 support to authentication module"

# 3. Review the plan
.\ollama-prompts.bat review-plan "$(Get-Content plan.txt -Raw)"

# 4. If approved, proceed with implementation
.\ollama-prompts.bat implement "$(Get-Content approved-plan.txt -Raw)"
```

## Model Information

- **Model**: llama3.1:8b (default, configurable per prompt)
- **Context window**: ~8k tokens
- **Speed**: Varies by hardware; typically 5-30 seconds per response

To use a different model, edit the `model:` field in the prompt YAML frontmatter.

## Tips & Best Practices

1. **Provide context**: Include relevant code excerpts or file paths in your requests
2. **Iterative refinement**: Use the review step to catch issues before implementation
3. **Hardware**: Larger models run faster on GPUs; fallback to CPU for 3B parameter models
4. **Timeout**: Allow 30+ seconds for response on slower hardware

## Troubleshooting

**"Ollama is not running"**
- Start Ollama with `ollama serve` before running prompts

**"Model not found"**
- Pull the model: `ollama pull llama3.1:8b`
- Or use a different model: `ollama list` to see available models

**"Request timeout"**
- Ollama is processing; on slower hardware, responses may take 30-60 seconds
- Check Ollama logs for errors

**PowerShell execution policy (Windows)**
- If scripts won't run, set policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## Related Documentation

- `.github/prompts/init.prompt.md` - Copilot equivalent
- `.github/prompts/plan.prompt.md` - Copilot equivalent  
- `.github/prompts/review-plan.prompt.md` - Copilot equivalent
- `.github/prompts/implement.prompt.md` - Copilot equivalent
