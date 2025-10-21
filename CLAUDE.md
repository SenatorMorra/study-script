# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Study Script is an educational programming language designed to teach programming fundamentals by simulating low-level memory operations through high-level commands. The language uses `.ess` file extensions and is implemented as an interpreter in Node.js.

The project includes:
- A custom language interpreter (Study_Script class)
- Bidirectional translator between Study Script and JavaScript
- Bilingual documentation (English/Russian)
- Educational materials and coding exercises

## Development Commands

### Running the Compiler
```bash
# Run with watch mode (auto-reload on changes)
npm start

# Run compiler directly on a .ess file
node compiler.js
```

Note: `compiler.js` is a test harness that reads from `time_utc.ss` (hardcoded). To run different files, modify line 7 in `compiler.js`.

### Testing
There is currently no automated test suite. Manual testing is done by creating `.ess` files and running them through the compiler.

## Architecture

### Core Components

**`index.js`** - Main interpreter implementation
- Exports the `Study_Script` class (default export)
- Contains two standalone translator functions:
  - `translate()`: Study Script → JavaScript
  - `reverseTranslate()`: JavaScript → Study Script
- Note: Translator functions are defined but not exported

**`compiler.js`** - Simple example/test runner
- Creates a Study_Script instance
- Reads and executes a `.ess` file
- Demonstrates basic usage pattern

### Engine Architecture

The interpreter is organized into two subsystems:

**System Modules** (`engine/system/`)
- `computer.js`: Initializes runtime state (storage, loops, flags)
- `detect_command.js`: Command router/dispatcher
- `strict_policy.js`: Syntax validation
- `catch_error.js`: Error handling and reporting
- `no_comments.js`: Comment stripping (comments start with `?`)
- `garbage_collector.js`: Calculates memory not freed by `delete` commands

**Command Modules** (`engine/command/`)
- Process commands: `start.js`, `finish.js`
- Variable commands: `new.js`, `set.js`, `delete.js`
- Condition commands: `if.js`, `else.js`, `close.js`
- Loop commands: `loop.js`, `end.js`
- I/O commands: `log.js`

### Execution Flow

1. Code is split into lines
2. Each line is processed sequentially:
   - Comments stripped via `no_comments()`
   - Syntax validated via `strict_policy()`
   - Command detected and dispatched via `detect_command()`
   - Command handler executes with access to:
     - `storage`: Variable storage (Map-like structure)
     - `loops`: Loop state tracking
     - `is_start`: Flag tracking if `start` was called
     - `ignore`: State for conditional execution (if/else)
3. After execution completes, metrics are logged:
   - Compilation time (ms)
   - Forgotten garbage size (bytes)

### Study Script Language Essentials

**Program Structure:**
```
start           # Required: initializes memory
<commands>      # Your code
finish          # Required: cleanup and terminate
```

**Data Types:**
- `number`: Numeric values
- `string`: Text data

**Key Commands:**
- `new <var> <type>`: Declare variable
- `set <var> <expression>`: Assign value
- `delete <var>`: Free memory
- `log <type> <expression>`: Output to console
- `if (<condition>)` ... `close`: Conditional
- `loop <name> (<condition>)` ... `end <name>`: While loop
- `? <text>`: Comment

**Important Syntax Notes:**
- String concatenation uses `+` for values
- String interpolation uses `>>` to join variables into strings
- Conditions use `>` for comparison (greater than)
- Loop names are required and must match between `loop` and `end`

## File Organization

```
/engine/
  /command/       # Command implementations
  /system/        # System utilities
/documentation/
  /en/            # English documentation
  /ru/            # Russian documentation
/education/
  /en/            # English educational materials
    /solution/5/  # Example .ess programs
  /ru/            # Russian educational materials
```

## Important Notes

- The project uses ES modules (`"type": "module"` in package.json)
- All imports must use `.js` extensions
- The language enforces strict syntax - `strict_policy.js` validates all commands
- Memory management is explicit - variables not deleted count as "garbage"
- The `start` command must be called before any variable operations
- Line numbers in error messages are 1-indexed
