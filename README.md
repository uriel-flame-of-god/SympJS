# SympJS - Symbolic Mathematics in TypeScript

A TypeScript library for symbolic mathematics inspired by SymPy, providing symbolic computation, automatic differentiation, and beautiful mathematical rendering.

## 🚀 Features

- **Symbolic Variables**: Create and manipulate mathematical symbols
- **Operator Overloading**: Natural mathematical syntax with `+`, `-`, `*`, `/`, `**`
- **Automatic Differentiation**: Symbolic derivatives using calculus rules
- **Beautiful Rendering**: Professional mathematical typography with proper spacing and symbols
- **Expression Trees**: Build and manipulate complex mathematical expressions

## 📦 Installation

```bash
npm install sympjs
```

## 🎯 Quick Start

```typescript
import { symbols, diff } from 'sympjs/types/symbols';
import { Render } from 'sympjs/lib/render';

// Create symbolic variables
const [x, y] = symbols('x', 'y');

// Build expressions naturally
const expr = x.pow(2).add(y.mul(3));  // x² + 3y

// Compute derivatives symbolically
const derivative = diff(expr, x);     // 2x

// Render beautifully
const renderer = new Render();
renderer.renderSymbolic(expr, 'math-container');
```

## 📚 API Reference

### Core Symbols

```typescript
import { symbols } from 'sympjs/types/symbols';

// Create variables
const [x, y, z] = symbols('x', 'y', 'z');

// Arithmetic operations
const expr1 = x.add(y);           // x + y
const expr2 = x.mul(y);           // x * y  
const expr3 = x.pow(2);           // x²
const expr4 = x.div(y);           // x / y

// Operator overloading (alternative syntax)
const expr5 = x['+'](y)['*'](z);  // (x + y) * z
```

### Differentiation

```typescript
import { diff } from 'sympjs/lib/differentiate';

const [x, y] = symbols('x', 'y');
const expr = x.pow(3).add(x.mul(y));

// Function style
const derivative = diff(expr, x);  // 3x² + y

// Method style
const derivative2 = expr.diff(x);  // 3x² + y
```

### Rendering

```typescript
import { Render } from 'sympjs/lib/render';

const renderer = new Render();

// Render symbolic expressions
renderer.renderSymbolic(expr, 'container-id');

// Render mathematical text with symbols
renderer.render('∫x² dx = x³/3 + C', 'math-container');
renderer.render('∑_{i=1}^n i = n(n+1)/2', 'sum-container');
```

## 🎨 Mathematical Notation Support

### Symbols
- **Greek letters**: α, β, γ, δ, θ, π, ...
- **Operators**: ∫, ∑, ∂, ∇, √, ∞, ±, ×, ÷
- **Relations**: ≤, ≥, ≠, ≈, ∝

### Formatting
- **Superscripts**: `x^2` → x², `x^{n+1}` → xⁿ⁺¹
- **Subscripts**: `x_n` → xₙ, `x_{n+1}` → xₙ₊₁  
- **Fractions**: `a/b` → ½, `\frac{a}{b}` → ½
- **Variables**: Automatic italic styling

## 🔧 Advanced Usage

### Expression Building

```typescript
const [x, y] = symbols('x', 'y');

// Complex expressions
const complexExpr = x.pow(2)
  .add(y.mul(3))
  .sub(x.div(2))
  .mul(y.add(1));

// Equivalent to: (x² + 3y - x/2) * (y + 1)
```

### Multiple Derivatives

```typescript
const expr = x.pow(3).add(y.pow(2));
const firstDeriv = diff(expr, x);    // 3x²
const secondDeriv = diff(firstDeriv, x); // 6x
```

### Custom Containers

```html
<div id="math-container-1" app-type="math"></div>
<div class="custom-math" id="my-expression"></div>
```

```typescript
// Auto-detects containers with app-type="math"
const renderer = new Render();

// Add custom containers
const customDiv = document.getElementById('my-expression');
renderer.addContainer(customDiv);
```

## 🛠️ Development

### Project Structure
```
src/
├── types/
│   └── symbols.ts          # Core symbol classes
├── lib/
│   ├── differentiate.ts    # Differentiation engine
│   └── render.ts          # Beautiful math renderer
└── main.ts                # Usage examples
```

### Building from Source

```bash
git clone https://github.com/uriel-flame-of-god/sympjs
cd sympjs
npm install
npm run build
```

## 📖 Examples

### Basic Calculus

```typescript
const [x] = symbols('x');

// Power rule
const expr = x.pow(5);           // x⁵
const derivative = diff(expr, x); // 5x⁴

// Product rule  
const product = x.mul(x.add(1));  // x(x + 1)
const productDeriv = diff(product, x); // 2x + 1

// Quotient rule
const quotient = x.div(x.add(1)); // x/(x + 1)
const quotientDeriv = diff(quotient, x); // 1/(x + 1)²
```

### Beautiful Mathematical Expressions

```typescript
// Render complex expressions
renderer.render('\\frac{d}{dx} \\left( \\frac{x^2 + 1}{x - 1} \\right)', 'deriv-container');

// Render with mathematical symbols
renderer.render('&part;f/&part;x = 2x + 3y', 'partial-container');
renderer.render('&int; e^x dx = e^x + C', 'integral-container');
```

## 🎯 Roadmap

- [ ] Algebraic simplification
- [ ] Symbolic integration
- [ ] Equation solving
- [ ] Matrix operations
- [ ] LaTeX export
- [ ] Limit computation
- [ ] Series expansion

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests, report bugs, or suggest new features.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

Inspired by SymPy and other computer algebra systems. Mathematical rendering uses STIX Two Text font for professional typography.

---

**SympJS** - Bringing the power of symbolic mathematics to TypeScript! 🧮✨
