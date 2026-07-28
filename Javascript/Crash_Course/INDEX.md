# JavaScript Crash Course

A structured guide to JavaScript fundamentals with code examples.

## How to Use

Open any `.html` file in a browser and check the console (F12) for output.
Files with `type="module"` must be served via a local server (VS Code Live Server, etc.).

## Course Structure

### 01 — Basics
| Topic | File |
|-------|------|
| Variables, Data Types, `var`/`let`/`const` | `01_variables_datatypes.html` |
| Type Conversion, Coercion, `==` vs `===` | `02_type_conversion.html` |
| Operators (Arithmetic, Logical, Comparison, Ternary) | `03_operators.html` |
| String Methods & Properties | `04_strings.html` |
| Numbers, `Math`, `NaN`, `Infinity` | `05_numbers_math.html` |

### 02 — Control Flow
| Topic | File |
|-------|------|
| `if` / `else if` / `else`, Truthy/Falsy | `01_conditionals.html` |
| `switch` statement, Fall-through | `02_switch.html` |

### 03 — Loops
| Topic | File |
|-------|------|
| `for`, `for...of`, `for...in`, `break`/`continue` | `01_for_loops.html` |
| `while`, `do...while`, Practical examples | `02_while_loops.html` |

### 04 — Functions
| Topic | File |
|-------|------|
| Declarations, Expressions, Arrow Functions, Params | `01_declarations_expressions_arrow.html` |
| Scope, Closures, IIFE | `02_scope_closures_iife.html` |
| Callbacks, `this` keyword, `call`/`apply`/`bind` | `03_callbacks_this.html` |

### 05 — Arrays
| Topic | File |
|-------|------|
| Push/Pop/Shift/Unshift, Splice, Find, Sort, Map/Filter/Reduce, Spread, Destructuring | `01_array_methods.html` |

### 06 — Objects
| Topic | File |
|-------|------|
| Object Literals, Methods, Destructuring, Spread, JSON | `01_objects_destructuring_json.html` |
| Constructor Functions, Classes, `extends`, Getters/Setters | `02_prototypes_classes.html` |

### 07 — ES6+ Features
| Topic | File |
|-------|------|
| Template Literals, Map, Set, Symbols, `?.`, `??` | `01_es6_features.html` |
| ES6 Modules (`import`/`export`) | `02_modules.html` |

### 08 — Error Handling
| Topic | File |
|-------|------|
| `try` / `catch` / `finally`, Custom Errors | `01_error_handling.html` |

### 09 — Asynchronous JavaScript
| Topic | File |
|-------|------|
| Callbacks, Promises, `async`/`await`, Fetch API, `Promise.all` | `01_async_javascript.html` |

### 10 — DOM & Browser APIs
| Topic | File |
|-------|------|
| Selectors, Content/Style Manipulation, Events, Delegation, Forms | `01_dom_manipulation.html` |
| `localStorage`, `sessionStorage`, Geolocation, Timers | `02_storage_browser_apis.html` |

### 11 — Advanced Topics
| Topic | File |
|-------|------|
| Generators, Functional Programming, Event Loop, Proxy | `01_advanced_topics.html` |

---

## Projects

Full-stack applications that apply the concepts above:

| Project | Description |
|---------|-------------|
| `Projects/Calculator/` | Full calculator app (HTML + CSS + JS) |
| `Projects/Menu/` | Cafe menu with dynamic pricing |
| `Projects/mini_project/` | Voting system with `localStorage` |
| `Projects/Netflix_Clone/` | Netflix landing page clone with modal, FAQ, API |
| `Projects/Weather_App/` | Weather dashboard using OpenWeatherMap API |
| `Projects/car_crash/` | Canvas-based car dodging game |
| `Projects/snake_game/` | Classic snake game on canvas |
| `Projects/ML/` | AI gesture games using TensorFlow.js + Handpose |

---

## Topics Added (previously missing)

- `var` / `let` / `const` and hoisting
- Data types in depth (`null`, `undefined`, `Symbol`, `BigInt`)
- `==` vs `===`, truthy/falsy
- String methods (`.slice()`, `.split()`, `.includes()`, `.replace()`, etc.)
- Number/Math methods
- `while` / `do...while` loops
- Arrow functions, default parameters, rest params
- Scope, closures, IIFE
- `this` keyword, `call`/`apply`/`bind`
- `map`, `filter`, `reduce`, `some`, `every`
- Array and object destructuring
- Spread operator with objects
- Classes, `extends`, super, getters/setters
- `Map`, `Set`, `Symbol`
- Optional chaining (`?.`), nullish coalescing (`??`)
- `try` / `catch` / `finally`, custom errors
- `Promise.all`, `Promise.race`, error handling in fetch
- POST request with Fetch API
- Event delegation, event propagation
- ES6 Modules (`import`/`export`)
- Generators, functional programming concepts
- Event loop (microtasks vs macrotasks)
- `Proxy`
- Organised project structure
