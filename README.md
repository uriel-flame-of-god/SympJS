# @auriel/sympjs - Symbolic Mathematics in TypeScript

[![npm version](https://img.shields.io/npm/v/@auriel/sympjs.svg)](https://www.npmjs.com/package/@auriel/sympjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript library for symbolic mathematics inspired by SymPy, providing symbolic computation, automatic differentiation, and beautiful mathematical rendering.

## 🚀 Features

- **Symbolic Variables**: Create and manipulate mathematical symbols
- **Operator Overloading**: Natural mathematical syntax with `+`, `-`, `*`, `/`, `**`
- **Automatic Differentiation**: Symbolic derivatives using calculus rules
- **Beautiful Rendering**: Professional mathematical typography with proper spacing and symbols
- **Expression Trees**: Build and manipulate complex mathematical expressions
- **Zero Dependencies**: Lightweight and framework-agnostic

## 📦 Installation

```bash
npm install @auriel/sympjs
```

## 🎯 Quick Start

### Basic Usage

```typescript
import { symbols, diff, Render } from '@auriel/sympjs';

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

### Individual Imports

```typescript
import { symbols } from '@auriel/sympjs/types/symbols';
import { diff } from '@auriel/sympjs/lib/differentiate';
import { Render } from '@auriel/sympjs/lib/render';
```

## 📚 API Reference

### Core Symbols

```typescript
import { symbols } from '@auriel/sympjs';

// Create variables
const [x, y, z] = symbols('x', 'y', 'z');

// Arithmetic operations
const expr1 = x.add(y);           // x + y
const expr2 = x.mul(y);           // x * y  
const expr3 = x.pow(2);           // x²
const expr4 = x.div(y);           // x / y

// Operator overloading (alternative syntax)
const expr5 = x['+'](y)['*'](z);  // (x + y) * z

// Method chaining
const complexExpr = x.pow(2)
  .add(y.mul(3))
  .sub(x.div(2));  // x² + 3y - x/2
```

### Differentiation

```typescript
import { diff } from '@auriel/sympjs';

const [x, y] = symbols('x', 'y');
const expr = x.pow(3).add(x.mul(y));

// Function style
const derivative = diff(expr, x);  // 3x² + y

// Method style
const derivative2 = expr.diff(x);  // 3x² + y

// Higher-order derivatives
const secondDeriv = diff(derivative, x);  // 6x
```

### Beautiful Rendering

```typescript
import { Render } from '@auriel/sympjs';

const renderer = new Render();

// Render symbolic expressions
renderer.renderSymbolic(expr, 'container-id');

// Render mathematical text with symbols
renderer.render('∫x² dx = x³/3 + C', 'math-container');
renderer.render('∑_{i=1}^n i = n(n+1)/2', 'sum-container');
renderer.render('&part;f/&part;x = 2x + 3y', 'partial-container');

```

## 🎨 Mathematical Notation Support

### Supported Symbols
- **Greek letters**: α, β, γ, δ, θ, π, ...
- **Operators**: ∫, ∑, ∂, ∇, √, ∞, ±, ×, ÷
- **Relations**: ≤, ≥, ≠, ≈, ∝
- **Primes**: ′, ″

### Beautiful Formatting
- **Superscripts**: `x^2` → x², `x^{n+1}` → xⁿ⁺¹
- **Subscripts**: `x_n` → xₙ, `x_{n+1}` → xₙ₊₁  
- **Fractions**: `a/b` → ½, `\frac{a}{b}` → ½
- **Variables**: Automatic italic styling with color coding
- **Parentheses**: Smart sizing with `\left(` and `\right)`

## 🔧 Advanced Usage

### HTML Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>Math Demo</title>
</head>
<body>
    <h1>Mathematical Expressions</h1>
    
    <!-- Auto-detected containers -->
    <div id="expression-1" app-type="math"></div>
    <div id="derivative-1" app-type="math"></div>
    
    <!-- Custom containers -->
    <div id="custom-math"></div>

    <script type="module">
        import { symbols, diff, Render } from '@auriel/sympjs';
        
        const [x, y] = symbols('x', 'y');
        const expr = x.pow(2).add(y.mul(3));
        const derivative = diff(expr, x);
        
        const renderer = new Render();
        renderer.renderSymbolic(expr, 'expression-1');
        renderer.renderSymbolic(derivative, 'derivative-1');
        renderer.render('Beautiful ∫ math!', 'custom-math');
    </script>
</body>
</html>
```

### Calculus Examples

```typescript
import { symbols, diff } from '@auriel/sympjs';

const [x, y] = symbols('x', 'y');

// Power rule
const powerExpr = x.pow(5);                    // x⁵
const powerDeriv = diff(powerExpr, x);         // 5x⁴

// Product rule  
const product = x.mul(x.add(1));               // x(x + 1)
const productDeriv = diff(product, x);         // 2x + 1

// Quotient rule
const quotient = x.div(x.add(1));              // x/(x + 1)
const quotientDeriv = diff(quotient, x);       // 1/(x + 1)²

// Chain of operations
const complex = x.pow(3)
  .add(y.pow(2))
  .mul(x.sub(y));                             // (x³ + y²)(x - y)
const complexDeriv = diff(complex, x);        // (3x²)(x - y) + (x³ + y²)
```

## 🎯 Real-world Examples

### Educational Tool

```typescript
// Demonstrate derivative rules
const [x] = symbols('x');
const functions = [
  x.pow(2),           // x²
  x.pow(3),           // x³
  x.mul(x.add(1)),    // x(x + 1)
  x.div(x.add(1))     // x/(x + 1)
];

functions.forEach((fn, i) => {
  const derivative = diff(fn, x);
  renderer.renderSymbolic(fn, `function-${i}`);
  renderer.renderSymbolic(derivative, `derivative-${i}`);
});
```

### Mathematical Documentation

```typescript
// Create beautiful mathematical documentation
renderer.render('The derivative of x² is:', 'desc-1');
renderer.renderSymbolic(diff(x.pow(2), x), 'result-1');

renderer.render('Product rule: d/dx[u·v] = u·dv/dx + v·du/dx', 'rule-1');
renderer.render('Quotient rule: d/dx[u/v] = (v·du/dx - u·dv/dx)/v²', 'rule-2');
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
├── index.ts               # Main exports
└── main.ts                # Usage examples
```

### Building from Source

```bash
git clone https://github.com/uriel-flame-of-god/SympJS
cd SympJS
npm install
npm run build
```

## 🎯 Roadmap

- [ ] Algebraic simplification engine
- [ ] Symbolic integration capabilities
- [ ] Equation solving system
- [ ] Matrix operations and linear algebra
- [ ] LaTeX import/export
- [ ] Limit computation
- [ ] Series expansion (Taylor, Fourier)
- [ ] Complex number support
- [ ] 3D mathematical plotting

## 🤝 Contributing

We welcome contributions! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a Pull Request
4. Report bugs or suggest features in [GitHub Issues](https://github.com/uriel-flame-of-god/SympJS/issues)

## 📄 License

MIT License - see [LICENSE](https://github.com/uriel-flame-of-god/SympJS/blob/main/LICENSE) file for details.

## 🔗 Links

- **NPM Package**: [@auriel/sympjs](https://www.npmjs.com/package/@auriel/sympjs)
- **GitHub Repository**: [SympJS](https://github.com/uriel-flame-of-god/SympJS)
- **Issues & Bugs**: [GitHub Issues](https://github.com/uriel-flame-of-god/SympJS/issues)

## 🙏 Acknowledgments

Inspired by SymPy and other computer algebra systems. Mathematical rendering uses STIX Two Text font for professional typography.

---

**@auriel/sympjs** - Bringing the elegance of symbolic mathematics to the web! 🧮✨

*Created by [Debaditya Malakar](https://github.com/uriel-flame-of-god)*
