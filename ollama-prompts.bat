@echo off
REM Ollama Prompts CLI Interface for Windows
REM Provides commands to invoke Ollama-based development prompts

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "PROMPTS_DIR=%SCRIPT_DIR%.github\prompts"
set "LAST_PLAN_FILE=%SCRIPT_DIR%.ollama-last-plan.txt"
set "LAST_REVIEW_FILE=%SCRIPT_DIR%.ollama-last-review.txt"

if not defined OLLAMA_BASE_URL set "OLLAMA_BASE_URL=http://127.0.0.1:11434"
if not defined OLLAMA_CHAT_MODEL set "OLLAMA_CHAT_MODEL=llama3.1:8b"
set "OLLAMA_API_URL=%OLLAMA_BASE_URL%/api/tags"

REM Check if Ollama is running
:check_ollama
for /f "delims=" %%i in ('powershell.exe -NoProfile -Command "try { Invoke-RestMethod -Uri '%OLLAMA_API_URL%' -TimeoutSec 2 -ErrorAction Stop | Out-Null; Write-Host 'OK' } catch { Write-Host 'FAIL' }" 2^>^&1') do set "OLLAMA_STATUS=%%i"

if "%OLLAMA_STATUS%"=="FAIL" (
    color 0C
    echo Error: Ollama is not running at %OLLAMA_BASE_URL%. Start it with: ollama serve
    echo Tested endpoint: %OLLAMA_API_URL%
    color 07
    exit /b 1
)

REM Parse command
if "%1%"=="" goto show_help
if /i "%1%"=="init" goto cmd_init
if /i "%1%"=="plan" goto cmd_plan
if /i "%1%"=="review-plan" goto cmd_review_plan
if /i "%1%"=="implement" goto cmd_implement
if /i "%1%"=="help" goto show_help

color 0C
echo Error: Unknown command '%1%'
color 07
echo Run '%0% help' for usage information
exit /b 1

:cmd_init
color 0B
echo Running: ollama-init
color 07
call :call_ollama "init" ""
goto :eof

:cmd_plan
if "%2%"=="" (
    color 0C
    echo Error: Please provide a task description
    color 07
    exit /b 1
)
color 0B
echo Running: ollama-plan
color 07
call :call_ollama "plan" "%2%" "" "%LAST_PLAN_FILE%"
goto :eof

:cmd_review_plan
if "%2%"=="" (
    if not exist "%LAST_PLAN_FILE%" (
        color 0C
        echo Error: No cached plan found. Run '%0% plan "Your task description"' first.
        color 07
        exit /b 1
    )
    color 0B
    echo Running: ollama-review-plan (using cached plan)
    color 07
    call :call_ollama "review-plan" "" "%LAST_PLAN_FILE%" "%LAST_REVIEW_FILE%"
    goto :eof
)
color 0B
echo Running: ollama-review-plan
color 07
call :call_ollama "review-plan" "%2%" "" "%LAST_REVIEW_FILE%"
goto :eof

:cmd_implement
if "%2%"=="" (
    if exist "%LAST_REVIEW_FILE%" (
        color 0B
        echo Running: ollama-implement (using cached reviewed plan)
        color 07
        call :call_ollama "implement" "" "%LAST_REVIEW_FILE%" ""
        goto :eof
    ) else if exist "%LAST_PLAN_FILE%" (
        color 0B
        echo Running: ollama-implement (using cached plan)
        color 07
        call :call_ollama "implement" "" "%LAST_PLAN_FILE%" ""
        goto :eof
    )
    color 0C
    echo Error: No cached plan or review found. Run '%0% plan "Your task description"' first.
    color 07
    exit /b 1
)
color 0B
echo Running: ollama-implement
color 07
call :call_ollama "implement" "%2%" "" ""
goto :eof

:call_ollama
REM Extract prompt content and call Ollama
REM Using PowerShell for better JSON handling
set "PROMPT_FILE=%PROMPTS_DIR%\ollama-%1%.prompt.md"
set "PS_SCRIPT=%TEMP%\ollama-prompts-call-%RANDOM%.ps1"
> "%PS_SCRIPT%" echo param($promptFile,$promptContext,$promptContextFile,$outputFile)
>> "%PS_SCRIPT%" echo $baseUrl = $Env:OLLAMA_BASE_URL
>> "%PS_SCRIPT%" echo $chatModel = $Env:OLLAMA_CHAT_MODEL
>> "%PS_SCRIPT%" echo if ([string]::IsNullOrWhiteSpace($baseUrl)) { Write-Host "Error: OLLAMA_BASE_URL is not defined." -ForegroundColor Red; exit 1 }
>> "%PS_SCRIPT%" echo if (-not (Test-Path $promptFile)) { Write-Host "Error: Prompt file not found: $promptFile" -ForegroundColor Red; exit 1 }
>> "%PS_SCRIPT%" echo $promptContent = Get-Content $promptFile -Raw
>> "%PS_SCRIPT%" echo $context = if (-not [string]::IsNullOrWhiteSpace($promptContextFile) -and (Test-Path $promptContextFile)) { Get-Content $promptContextFile -Raw } else { $promptContext }
>> "%PS_SCRIPT%" echo $modelMatch = $promptContent ^| Select-String -Pattern 'model:\s*(\S+)'
>> "%PS_SCRIPT%" echo $model = if (-not [string]::IsNullOrWhiteSpace($chatModel)) { $chatModel } elseif ($modelMatch) { $modelMatch.Matches[0].Groups[1].Value } else { 'llama3.1:8b' }
>> "%PS_SCRIPT%" echo Write-Host "Using model: $model" -ForegroundColor Cyan
>> "%PS_SCRIPT%" echo Write-Host 'Calling Ollama...' -ForegroundColor Cyan
>> "%PS_SCRIPT%" echo Write-Host ''
>> "%PS_SCRIPT%" echo $fullPrompt = $promptContent + "`n---`nContext:`n" + $context
>> "%PS_SCRIPT%" echo try {
>> "%PS_SCRIPT%" echo     $response = Invoke-RestMethod -Uri "$baseUrl/api/generate" -Method Post -ContentType 'application/json' -Body (@{ model = $model; prompt = $fullPrompt; stream = $false } ^| ConvertTo-Json)
>> "%PS_SCRIPT%" echo     if (-not [string]::IsNullOrWhiteSpace($outputFile)) { $response.response ^| Out-File -FilePath $outputFile -Encoding utf8 }
>> "%PS_SCRIPT%" echo     Write-Host $response.response
>> "%PS_SCRIPT%" echo } catch {
>> "%PS_SCRIPT%" echo     Write-Host "Error calling Ollama: $_.Exception.Message" -ForegroundColor Red
>> "%PS_SCRIPT%" echo     exit 1
>> "%PS_SCRIPT%" echo }
powershell.exe -NoProfile -File "%PS_SCRIPT%" "%PROMPT_FILE%" "%~2" "%~3" "%~4%"
del /f /q "%PS_SCRIPT%" >nul 2>nul
goto :eof

:show_help
cls
color 0A
echo.
echo Ollama Prompts CLI - Development assistance using local Ollama instance
echo.
color 07
echo Usage: %0% ^<command^> [options]
echo.
echo Commands:
echo     init                 Analyze repository and build structural understanding
echo     plan ^<task^>          Create implementation plan for a task
echo     review-plan ^<plan^>   Review a proposed implementation plan
echo     implement ^<context^> Implement an approved plan
echo     help                 Show this help message
echo.
echo Examples:
echo     %0% init
echo     %0% plan "Add user authentication with JWT"
echo     %0% review-plan
echo     %0% implement
echo.
echo Requirements:
echo     - Ollama running locally (ollama serve)
echo     - Model pulled (ollama pull llama3.1:8b)
echo.
color 07
goto :eof

endlocal
