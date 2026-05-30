#!/bin/bash
# Ollama Prompts CLI Interface
# Provides commands to invoke Ollama-based development prompts

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROMPTS_DIR="$SCRIPT_DIR/.github/prompts"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Ollama is running
check_ollama() {
    if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "${RED}Error: Ollama is not running. Start it with: ollama serve${NC}"
        exit 1
    fi
}

# Load prompt content
load_prompt() {
    local prompt_name=$1
    local prompt_file="$PROMPTS_DIR/ollama-$prompt_name.prompt.md"
    
    if [[ ! -f "$prompt_file" ]]; then
        echo -e "${RED}Error: Prompt file not found: $prompt_file${NC}"
        exit 1
    fi
    
    cat "$prompt_file"
}

# Extract model and prompt instructions
get_prompt_config() {
    local prompt_name=$1
    local prompt_file="$PROMPTS_DIR/ollama-$prompt_name.prompt.md"
    
    # Extract model from YAML frontmatter
    local model=$(grep -A 10 "^---" "$prompt_file" | grep "^model:" | awk '{print $2}')
    
    # Extract description
    local description=$(grep "^description:" "$prompt_file" | cut -d: -f2- | xargs)
    
    echo "$model"
}

# Call Ollama with prompt
call_ollama() {
    local prompt_name=$1
    local context=$2
    
    local model=$(get_prompt_config "$prompt_name")
    [[ -z "$model" ]] && model="llama3.2:3b"
    
    local prompt_content=$(load_prompt "$prompt_name")
    local full_prompt="$prompt_content

---

Context:
$context"
    
    echo -e "${BLUE}Using model: $model${NC}"
    echo -e "${BLUE}Calling Ollama...${NC}\n"
    
    # Call Ollama API
    curl -s -X POST http://localhost:11434/api/generate \
        -d "{\"model\": \"$model\", \"prompt\": $(echo "$full_prompt" | jq -Rs .), \"stream\": true}" \
        | jq -r '.response' 2>/dev/null | tr -d '\000'
}

# Commands
case "${1:-}" in
    init)
        check_ollama
        echo -e "${BLUE}Running: ollama-init${NC}"
        call_ollama "init" ""
        ;;
    
    plan)
        check_ollama
        echo -e "${BLUE}Running: ollama-plan${NC}"
        if [[ -z "$2" ]]; then
            echo -e "${RED}Error: Please provide a task description${NC}"
            exit 1
        fi
        call_ollama "plan" "$2"
        ;;
    
    review-plan)
        check_ollama
        echo -e "${BLUE}Running: ollama-review-plan${NC}"
        if [[ -z "$2" ]]; then
            echo -e "${RED}Error: Please provide the plan to review${NC}"
            exit 1
        fi
        call_ollama "review-plan" "$2"
        ;;
    
    implement)
        check_ollama
        echo -e "${BLUE}Running: ollama-implement${NC}"
        if [[ -z "$2" ]]; then
            echo -e "${RED}Error: Please provide implementation context${NC}"
            exit 1
        fi
        call_ollama "implement" "$2"
        ;;
    
    help)
        cat << EOF
Ollama Prompts CLI - Development assistance using local Ollama instance

Usage: $0 <command> [options]

Commands:
    init                 Analyze repository and build structural understanding
    plan <task>          Create implementation plan for a task
    review-plan <plan>   Review a proposed implementation plan
    implement <context>  Implement an approved plan
    help                 Show this help message

Examples:
    $0 init
    $0 plan "Add user authentication with JWT"
    $0 review-plan "$(cat plan.txt)"
    $0 implement "$(cat implementation-context.txt)"

Requirements:
    - Ollama running locally (ollama serve)
    - Model pulled (ollama pull llama3.2:3b)
    - jq installed for JSON processing

EOF
        ;;
    
    *)
        echo -e "${RED}Error: Unknown command '${1:-}'${NC}"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac
