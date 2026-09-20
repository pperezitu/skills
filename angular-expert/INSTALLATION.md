# Installation & Usage Guide

## Installation

The `angular-expert` skill is already installed at:
```
~/.agents/skills/angular-expert/
```

It's ready to use immediately with Warp agents.

### Verify Installation

Check that all files are in place:
```bash
ls -la ~/.agents/skills/angular-expert/
```

Expected structure:
```
SKILL.md                      # Main skill documentation
README.md                     # Overview and features
INSTALLATION.md              # This file
skill.config.json            # Configuration
references/
  ├── solid-principles.md    # SOLID principles guide
  ├── common-patterns.md     # Angular patterns
  └── practical-examples.md  # Real-world scenarios
scripts/
  └── detect-angular-config.ts  # Configuration detector
```

## How to Use

### 1. Automatic Activation (Recommended)

The skill activates automatically when:
- Working with Angular projects (detected `@angular/core` in package.json)
- File contains Angular code (`.component.ts`, `angular.json`, etc.)
- Mentioning Angular-related keywords

**Just ask normally:**
```
"Create a user service that fetches data from the API"
"I need a component to display a list of products"
"Help me refactor this component with SOLID principles"
```

The skill will trigger automatically and help you.

### 2. Manual Activation

Explicitly invoke the skill:
```
"Use the Angular expert skill to..."
"I need Angular guidance on..."
"What's the best pattern for..."
```

## Typical Workflow

### Example: Create a Data Service

**You:** "I need a service to fetch and manage user data"

**Skill detects:**
- Angular version: 16 ✓
- Testing framework: Jasmine ✓
- Project structure: Standalone ✓

**Skill proposes:**
```
A) Standard HTTP Service
B) Reactive Service with RxJS
C) Signals-based Service

Which do you prefer?
```

**You:** "Option C"

**Skill generates:**
- Production-ready service code
- Follows SOLID principles
- Type-safe TypeScript

**Skill asks:**
```
"Add unit tests?
- Happy path (normal operation)
- Edge cases (boundary conditions)
- Error scenarios"
```

**You:** "Yes"

**Skill generates:**
- Comprehensive unit tests
- AAA pattern (Arrange, Act, Assert)
- Covers all scenarios

## Best Practices

### 1. Be Specific in Requests
❌ "Create a component"
✅ "Create a user profile component that displays user info and allows editing"

### 2. Provide Context
❌ "Fix this"
✅ "This component loads slowly. Can you optimize the change detection?"

### 3. Ask Questions if Unsure
The skill always proposes multiple patterns. Choose the one that fits best.

### 4. Review Generated Code
The skill generates expert-level code, but always review it for:
- Alignment with your project's conventions
- Any specific business logic adjustments
- Integration with existing code

### 5. Tests Are Optional
If you don't want tests, just say "no" when asked. Tests are always generated separately.

## Configuration Reference

See `skill.config.json` for:
- Supported Angular versions (11-18+)
- Testing framework detection (Jasmine/Jest)
- Code generation preferences
- Available patterns and features

## Troubleshooting

### Skill Not Triggering Automatically?

**Solution 1:** Ensure you're in an Angular project
```bash
# Check if package.json contains @angular/core
grep "@angular/core" package.json
```

**Solution 2:** Explicitly invoke the skill
```
"Use the Angular expert skill"
```

### Need Project Configuration Detection?

Run the configuration detector script:
```bash
# Requires Node.js and ts-node
npx ts-node scripts/detect-angular-config.ts
```

Output example:
```
📊 Angular Project Configuration:
================================
Angular Version: 16.2.0
TypeScript: 5.1.6 (Strict: true)
Testing Framework: jasmine
Project Structure: standalone

Features:
  ✓ Standalone Components: true
  ✓ Signals: true
  ✓ Control Flow Syntax: true
```

### Unsure About SOLID Principles?

Reference documentation is included:
- `references/solid-principles.md` - Detailed SOLID examples
- `references/common-patterns.md` - Patterns and best practices
- `references/practical-examples.md` - Real-world scenarios

## Token Efficiency Tips

The skill is designed to minimize token usage:

1. **Ask focused questions**
   - Instead of long explanations
   - Get straight to the point

2. **Reference patterns**
   - Skill references documentation
   - No repetition of patterns

3. **Offer choices**
   - A/B/C pattern selection
   - No lengthy pros/cons

4. **Clear decisions**
   - Once you choose, code is generated
   - No back-and-forth debate

**Example interaction (low tokens):**
```
You: "Data service for products"
Skill: "Standard, Reactive, or Signals?"
You: "Signals"
Skill: [generates code and asks about tests]
You: "Yes"
Skill: [generates tests]
```

## Features Overview

### Code Generation
- ✅ Components (traditional, reactive, standalone)
- ✅ Services (HTTP, reactive, signal-based)
- ✅ Pipes, Guards, Directives, Interceptors
- ✅ State management solutions

### Testing
- ✅ Jasmine unit tests
- ✅ Jest unit tests
- ✅ AAA pattern (Arrange, Act, Assert)
- ✅ Happy path, edge cases, error scenarios

### Patterns
- ✅ SOLID principles
- ✅ Clean Code
- ✅ Clean Architecture
- ✅ Reactive programming
- ✅ Dependency injection
- ✅ State management

### Modern Features
- ✅ Standalone Components (Angular 14+)
- ✅ Signals (Angular 16+)
- ✅ Control Flow Syntax (Angular 17+)
- ✅ RxJS best practices
- ✅ TypeScript patterns
- ✅ Performance optimization

## Quick Reference

### Supported Versions
| Framework | Min Version | Recommended |
|-----------|------------|-------------|
| Angular   | 11.0.0     | 17.0.0      |
| TypeScript| 4.2        | 5.0         |
| Node      | 14.0.0     | 18.0.0      |

### Testing Frameworks
- Jasmine (default in Angular CLI)
- Jest (modern alternative)

### State Management Options
1. Services + RxJS (lightweight)
2. Signals (modern, angular 16+)
3. NgRx (enterprise)
4. Akita (medium complexity)

## Getting Help

The skill includes comprehensive documentation:

1. **SKILL.md** - Main workflow and principles
2. **README.md** - Features and overview
3. **references/solid-principles.md** - SOLID explained
4. **references/common-patterns.md** - Patterns and code examples
5. **references/practical-examples.md** - Real-world scenarios

## Tips for Best Results

### 1. Describe Business Logic
```
"Create a component that shows user profile, 
with fields for name, email, and profile picture. 
Allow users to edit these fields and save changes."
```

### 2. Mention Constraints
```
"Create a data service for products. 
The component needs to handle large lists (1000+ items)
so performance is important."
```

### 3. Ask About Options
```
"What's the best way to manage state for this feature?
We have simple counters, user preferences, and async data."
```

### 4. Request Specific Patterns
```
"Create this with the Signals pattern (modern approach)
so we can learn that syntax."
```

## Next Steps

1. **Start with a simple request**
   - "Create a service to fetch users from `/api/users`"

2. **Let the skill guide you**
   - Answer pattern questions
   - Choose the approach that fits

3. **Review generated code**
   - Check alignment with your project
   - Adjust if needed

4. **Keep learning**
   - Reference the SOLID guide
   - Review patterns documentation

---

**You're ready to use angular-expert!** 🚀

Any issues? The skill will help you debug and improve your code.
