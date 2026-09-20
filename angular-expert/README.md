# Angular Expert Skill

Expert-level Angular development guidance (11+) with SOLID principles, Clean Code, and Clean Architecture.

## Overview

This skill provides comprehensive assistance for Angular development across:
- **Component architecture** (traditional, reactive, standalone with signals)
- **Service design** (HTTP, reactive state, signal-based)
- **State management** (NgRx, Akita, RxJS, Signals)
- **Testing strategy** (unit tests, integration tests, e2e)
- **Performance optimization** (change detection, lazy loading, memory management)
- **Type safety** (TypeScript patterns, generics, advanced types)

## Features

✅ **Automatic Detection**
- Detects Angular version (11+)
- Identifies testing framework (Jasmine/Jest)
- Recognizes project structure (modules vs. standalone)
- Suggests appropriate patterns based on your setup

✅ **Multiple Pattern Options**
- Always offers 2-3 architectural approaches
- Explains pros/cons for each option
- Lets you choose the best fit

✅ **Ask Before Generating**
- Never writes code without your approval
- Clarifies intent and requirements first
- Respects your project's patterns and conventions

✅ **Automatic Test Generation**
- Detects your testing framework
- Generates tests covering happy path, edge cases, error scenarios
- Uses AAA pattern (Arrange, Act, Assert)
- Includes helpful comments

✅ **SOLID + Clean Code + Clean Architecture**
- Single Responsibility (each class does one thing)
- Open/Closed (extensible, not modified)
- Liskov Substitution (types are interchangeable)
- Interface Segregation (focused interfaces)
- Dependency Inversion (depend on abstractions)

✅ **Modern Angular Features**
- Standalone Components (Angular 14+)
- Signals (Angular 16+)
- Control Flow Syntax (Angular 17+)
- Compatible back to Angular 11

✅ **Token Efficient**
- Minimal verbosity
- Focused recommendations
- No unnecessary explanations

## Quick Start

### Invoke the skill

Tell the agent what you need:

```
"I need a service to fetch user data from an API"
"Create a component to display a list of products"
"Set up state management for this feature"
"Help me refactor this component"
```

The skill will:
1. **Detect** your project configuration
2. **Propose** 2-3 architectural patterns
3. **Ask** which pattern you prefer
4. **Generate** production-ready code
5. **Offer** to create unit tests

### Example Interaction

```
User: "Create a service to fetch users"

Skill: "I see you're using Angular 16 with Jasmine. Here are three approaches:

A) Standard HTTP Service - Simple, straightforward
B) Reactive Service with RxJS - Advanced state management
C) Signals-based Service - Modern, fine-grained reactivity

Which do you prefer?"

User: "I like option C"

Skill: "Great! Here's your Signal-based service:
[generates code]

Want me to add unit tests?"

User: "Yes"

Skill: [generates comprehensive tests]
```

## What's Included

### SKILL.md
Main skill documentation with workflow, principles, and when to use.

### References

- **solid-principles.md** - Detailed SOLID examples with Angular context
- **common-patterns.md** - Service patterns, component patterns, testing patterns

### Scripts

- **detect-angular-config.ts** - Detects Angular version, testing framework, project structure

## Supported Angular Versions

| Version | Release | Features |
|---------|---------|----------|
| 11-13   | 2020-21 | Traditional NgModule-based, Ivy |
| 14      | 2022-06 | Standalone components, typed forms |
| 15      | 2022-11 | Improvements to standalone |
| 16      | 2023-05 | Signals, computed, effect |
| 17      | 2023-11 | Control Flow syntax, signal refinements |
| 18+     | 2024+   | Signal-based by default patterns |

## Skill Behavior

### Automatic Triggers
The skill activates automatically when:
- Project contains `@angular/core` in package.json
- User imports from `@angular/` packages
- File mentions `angular.json` or `.component.ts`
- Request involves routing, services, components, pipes, guards

### Manual Invocation
Ask explicitly for Angular help:
- "Use the Angular expert skill"
- "Angular component help"
- "SOLID principles for this service"

### No Code Without Approval
The skill NEVER:
- Generates code without asking which pattern you prefer
- Creates components/services you didn't request
- Modifies your existing code without permission
- Makes assumptions about your project structure

## Token Efficiency Strategy

The skill minimizes tokens by:
- Asking focused questions instead of long explanations
- Referencing patterns in `references/` instead of repeating them
- Offering choices (A/B/C) instead of lengthy pros/cons
- Using TypeScript strictly (no verbose `any` types)
- Including only necessary comments (architecture, not obvious code)

Example token savings:
- ❌ "Here's a component with detailed explanation of lifecycle hooks..."
- ✅ "Here's your component with OnPush strategy for performance"

## Best Practices Used

### DRY (Don't Repeat Yourself)
Services encapsulate HTTP calls; components consume them.

### KISS (Keep It Simple, Stupid)
No unnecessary abstractions; straightforward solutions first.

### YAGNI (You Aren't Gonna Need It)
Only generate what you actually need; avoid "just in case" code.

### Composition Over Inheritance
Prefer interfaces and composition patterns over class hierarchies.

### Testability First
Every generated class is designed to be tested easily.

## Examples in This Skill

### Service Examples
- Standard HTTP service
- Reactive service with BehaviorSubject
- Signals-based service with fine-grained reactivity

### Component Examples
- Traditional class component with lifecycle
- Reactive component with async pipe
- Standalone component with Signals

### Testing Examples
- Component unit tests with TestBed
- Service tests with HttpClientTestingModule
- Testing patterns for modern Angular (Signals, standalone)

## FAQ

**Q: Will the skill modify my existing code?**
A: No. It only generates new files or code you explicitly approve.

**Q: Can I use this for Angular 11?**
A: Yes. The skill supports 11+ and adapts recommendations to your version.

**Q: What if I don't want tests?**
A: The skill asks before generating tests. You can skip them if you prefer.

**Q: Does it work with NgRx?**
A: Yes. The skill offers NgRx as one state management option.

**Q: Can I mix approaches?**
A: Yes. The skill works with any combination of patterns in your project.

**Q: How does it know my project config?**
A: It reads `package.json`, `angular.json`, and `tsconfig.json`.

## Architecture

```
angular-expert/
├── SKILL.md                          # Main skill documentation
├── README.md                         # This file
├── references/
│   ├── solid-principles.md          # SOLID with Angular examples
│   └── common-patterns.md           # Service, component, test patterns
└── scripts/
    └── detect-angular-config.ts     # Project configuration detector
```

## Support

The skill handles:
- ✅ Components (class-based, reactive, standalone)
- ✅ Services (HTTP, reactive, signal-based)
- ✅ State management (simple services, RxJS, NgRx, Signals)
- ✅ Pipes, guards, interceptors, directives
- ✅ Testing (unit, integration concepts)
- ✅ Routing and lazy loading concepts
- ✅ Performance optimization strategies
- ✅ TypeScript advanced patterns
- ✅ RxJS best practices
- ✅ Dependency injection patterns

## Version History

- **v1.0** - Initial release with SOLID, Clean Code, Clean Architecture
- Supports Angular 11-18+
- Token-efficient with multiple pattern options

---

**Happy coding!** 🚀
