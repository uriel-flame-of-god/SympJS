# @auriel/sympjs - Symbolic Mathematics in TypeScript

[![npm version](https://img.shields.io/npm/v/@auriel/sympjs.svg)](https://www.npmjs.com/package/@auriel/sympjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive TypeScript library for symbolic mathematics inspired by SymPy, providing symbolic computation, automatic differentiation, algebraic simplification, equation solving, and beautiful mathematical rendering.

## 🚀 Features

### Core Symbolic Math
- **Symbolic Variables**: Create and manipulate mathematical symbols naturally
- **Operator Overloading**: Intuitive mathematical syntax with `+`, `-`, `*`, `/`, `^` operators
- **Automatic Differentiation**: Symbolic derivatives using calculus rules (power rule, product rule, quotient rule, chain rule)
- **Expression Trees**: Build and manipulate complex mathematical expressions with method chaining

### Advanced Algebra
- **Algebraic Simplification**: Automatically simplifies expressions using mathematical rules
  - Eliminates zero multiplication: `y*0 → 0`
  - Removes identity operations: `x + 0 → x`, `1 * x → x`
  - Simplifies powers: `x^0 → 1`, `x^1 → x`
  - Combines like terms: `x + x → 2x`
  - Simplifies constants: `2 + 3 → 5`

- **Equation Solving**:
  - Linear equations: `ax + b = 0`
  - Quadratic equations: `ax² + bx + c = 0` (using quadratic formula)
  - Symbolic coefficient extraction

- **Linear Algebra & Matrices**:
  - MxN matrix support (not limited to square matrices)
  - Scalar multiplication & matrix operations
  - Matrix multiplication: `(MxN) × (NxP) = (MxP)`
  - Matrix-vector multiplication
  - Transpose, Determinant, Matrix Inverse
  - Gaussian elimination for solving linear systems
  - LU decomposition for efficiency

### Rendering & Visualization
- **Beautiful Mathematical Typography**: Professional rendering with proper spacing and symbols
- **Symbol Support**: Greek letters, operators (∫, ∑, ∂), relations (≤, ≥, ≠), and more
- **Automatic HTML Integration**: Detects and renders to containers with `app-type="math"`
- **Multiple Rendering Formats**: Symbolic expressions, LaTeX, HTML, and mathematical text
- **Responsive Design**: Works seamlessly on desktop and mobile

### Developer Experience
- **Zero Dependencies**: Lightweight and framework-agnostic
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Method Chaining**: Fluent API for building complex expressions
- **ES6 Modules**: Modern module system ready for bundlers like Vite

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

// Simplify expressions
const simplified = Simplifier.simplify(
  y.pow(2).add(y.mul(3)).add(y.mul(0))
);  // y² + 3y (eliminates y*0)

// Render beautifully
const renderer = new Render();
renderer.renderSymbolic(expr, 'math-container');
renderer.renderSymbolic(derivative, 'derivative-container');
```

### HTML Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>SympJS Demo</title>
</head>
<body>
    <h1>Mathematical Expressions</h1>
    
    <!-- Auto-detected containers -->
    <div id="math-container-1" app-type="math"></div>
    <div id="math-container-2" app-type="math"></div>
    
    <!-- Custom container -->
    <div id="custom-math"></div>

    <script type="module">
        import { symbols, diff, Render, Simplifier } from '@auriel/sympjs';
        
        const [x, y] = symbols('x', 'y');
        const expr = x.pow(2).add(y.mul(3));
        const derivative = diff(expr, x);
        
        const renderer = new Render();
        renderer.renderSymbolic(expr, 'math-container-1');
        renderer.renderSymbolic(derivative, 'math-container-2');
        renderer.render('∫x² dx = x³/3 + C', 'custom-math');
    </script>
</body>
</html>
```

## 📚 API Reference

### Core Symbols

```typescript
import { symbols, Constant, diff } from '@auriel/sympjs';

// Create variables
const [x, y, z] = symbols('x', 'y', 'z');

// Arithmetic operations
const expr1 = x.add(y);              // x + y
const expr2 = x.mul(y);              // x * y  
const expr3 = x.pow(2);              // x²
const expr4 = x.div(y);              // x / y
const expr5 = x.sub(y);              // x - y

// Method chaining
const complex = x.pow(3)
  .add(y.mul(2))
  .sub(x.div(2));                    // x³ + 2y - x/2

// Constants
const five = new Constant(5);
const expr6 = x.mul(5);              // 5x
```

### Differentiation

```typescript
import { diff } from '@auriel/sympjs';

const [x, y] = symbols('x', 'y');

// Function style
const d1 = diff(expr, x);            // Derivative with respect to x

// Method style
const d2 = expr.diff(x);             // Same result

// Higher-order derivatives
const d2dx2 = diff(diff(expr, x), x); // Second derivative

// Examples
diff(x.pow(3), x);                   // 3x²
diff(x.mul(y), x);                   // y (product rule)
diff(x.div(y), x);                   // 1/y (quotient rule)
```

### Algebraic Simplification

```typescript
import { Simplifier } from '@auriel/sympjs';

const [x, y] = symbols('x', 'y');

// Simplify expressions
const expr1 = y.pow(2).add(y.mul(3)).add(y.mul(0));
const simplified = Simplifier.simplify(expr1);  // y² + 3y

// More examples
Simplifier.simplify(x.add(0));                  // x
Simplifier.simplify(x.mul(1));                  // x
Simplifier.simplify(x.pow(0));                  // 1
Simplifier.simplify(x.mul(x));                  // x²
Simplifier.simplify(x.add(x));                  // 2x
Simplifier.simplify(x.div(x));                  // 1
```

### Equation Solving

```typescript
import { EquationSolver } from '@auriel/sympjs';

const [x] = symbols('x');

// Linear equations: ax + b = 0
const linear = x.mul(2).add(4);
const xLinear = EquationSolver.solveLinear(linear, x);  // -2

// Quadratic equations: ax² + bx + c = 0
const quadratic = x.pow(2).sub(x.mul(5)).add(6);
const solutions = EquationSolver.solveQuadratic(quadratic, x);  // [3, 2]

// Returns [solution1, solution2] or null if no real solutions
```

### Matrix Operations

```typescript
import { Matrix } from '@auriel/sympjs';

// Create matrices (MxN support)
const A = new Matrix([
  [1, 2, 3],
  [4, 5, 6]
]);  // 2x3 matrix

const B = new Matrix([
  [1, 2],
  [3, 4],
  [5, 6]
]);  // 3x2 matrix

// Basic operations
const C = new Matrix([[1, 2], [3, 4]]);
const D = new Matrix([[5, 6], [7, 8]]);

C.add(D);                    // Matrix addition
C.subtract(D);               // Matrix subtraction
C.scalarMultiply(2);         // Scalar multiplication

// Matrix multiplication (MxN) × (NxP) = (MxP)
const product = A.multiply(B);  // (2x3) × (3x2) = (2x2)

// Vector operations
const vector = [1, 2, 3];
const result = A.multiplyVector(vector);  // Matrix-vector product

// Matrix properties
const C_T = C.transpose();   // Transpose
const det = C.determinant(); // Determinant (square only)
const inv = C.inverse();     // Inverse (square, invertible only)
const [rows, cols] = C.shape(); // Get dimensions

// Solve linear systems Ax = b
const augmented = new Matrix([
  [2, 1, 5],      // 2x + y = 5
  [1, 3, 4]       // x + 3y = 4
]);
const solution = augmented.gaussianElimination();  // [x, y]
```

### Rendering

```typescript
import { Render } from '@auriel/sympjs';

const renderer = new Render();

// Render symbolic expressions
renderer.renderSymbolic(expr, 'container-id');

// Render mathematical text with symbols
renderer.render('∫x² dx = x³/3 + C', 'math-container');
renderer.render('∑_{i=1}^n i = n(n+1)/2', 'sum-container');
renderer.render('∂f/∂x = 2x + 3y', 'partial-container');

// Get container IDs
const ids = renderer.getContainerIds();  // ['math-container-1', 'math-container-2', ...]

// Add/remove containers dynamically
const newDiv = document.createElement('div');
renderer.addContainer(newDiv);
renderer.removeContainer('math-container-1');

// Clear all containers
renderer.clearAll();
```

## 🎨 Mathematical Notation Support

### Supported Symbols
- **Greek letters**: `α, β, γ, δ, θ, π` (using HTML entities)
- **Operators**: `∫` (integral), `∑` (summation), `∂` (partial), `∇` (nabla), `√` (root), `∞` (infinity), `±`, `×`, `÷`
- **Relations**: `≤, ≥, ≠, ≈, ∝`
- **Primes**: `′, ″`

### Beautiful Formatting
- **Superscripts**: `x^2` → x², `x^{n+1}` → xⁿ⁺¹
- **Subscripts**: `x_n` → xₙ, `x_{n+1}` → xₙ₊₁  
- **Fractions**: `a/b` → ½, `\frac{a}{b}` → ½
- **Variables**: Automatic italic styling with color coding
- **Parentheses**: Smart sizing with `\left(` and `\right)`
- **Numbers**: Color-coded for distinction
- **Operators**: Properly spaced and styled

## 🔧 Advanced Examples

### Calculus Examples

```typescript
import { symbols, diff, Simplifier, Render } from '@auriel/sympjs';

const [x, y] = symbols('x', 'y');
const renderer = new Render();

// Power rule: d/dx[x⁵] = 5x⁴
const powerExpr = x.pow(5);
const powerDeriv = diff(powerExpr, x);
renderer.renderSymbolic(powerDeriv, 'power-rule');

// Product rule: d/dx[x(x + 1)] = 2x + 1
const productExpr = x.mul(x.add(1));
const productDeriv = diff(productExpr, x);
renderer.renderSymbolic(productDeriv, 'product-rule');

// Quotient rule: d/dx[x/(x + 1)] = 1/(x + 1)²
const quotientExpr = x.div(x.add(1));
const quotientDeriv = diff(quotientExpr, x);
renderer.renderSymbolic(quotientDeriv, 'quotient-rule');

// Complex expression
const complex = x.pow(3)
  .add(y.pow(2))
  .mul(x.sub(y));
const complexDeriv = diff(complex, x);
const simplified = Simplifier.simplify(complexDeriv);
renderer.renderSymbolic(simplified, 'complex-deriv');
```

### Linear Algebra Examples

```typescript
import { Matrix, EquationSolver } from '@auriel/sympjs';

// 2x2 System
const system2x2 = new Matrix([
  [2, 1, 5],   // 2x + y = 5
  [1, 3, 4]    // x + 3y = 4
]);
const sol2 = system2x2.gaussianElimination();
console.log(`Solution: x = ${sol2[0]}, y = ${sol2[1]}`);

// 3x3 System
const system3x3 = new Matrix([
  [3, 2, 1, 11],    // 3x + 2y + z = 11
  [1, 1, 1, 6],     // x + y + z = 6
  [2, 1, -1, 3]     // 2x + y - z = 3
]);
const sol3 = system3x3.gaussianElimination();
console.log(`Solution: x = ${sol3[0]}, y = ${sol3[1]}, z = ${sol3[2]}`);

// Matrix properties
const A = new Matrix([[1, 2], [3, 4]]);
console.log(`Determinant: ${A.determinant()}`);     // -2
console.log(`Inverse:`, A.inverse());
console.log(`Transpose:`, A.transpose());
```

### Educational Tool

```typescript
import { symbols, diff, Simplifier, Render } from '@auriel/sympjs';

const [x] = symbols('x');
const renderer = new Render();

// Demonstrate differentiation rules
const functions = [
  { name: 'Power', expr: x.pow(2) },
  { name: 'Product', expr: x.mul(x.add(1)) },
  { name: 'Quotient', expr: x.div(x.add(1)) },
  { name: 'Complex', expr: x.pow(3).add(x.mul(2)) }
];

functions.forEach((fn, i) => {
  const derivative = Simplifier.simplify(diff(fn.expr, x));
  renderer.renderSymbolic(fn.expr, `func-${i}`);
  renderer.renderSymbolic(derivative, `deriv-${i}`);
  console.log(`${fn.name}: ${fn.expr} → ${derivative}`);
});
```

## 🛠️ Development

### Project Structure
```
src/
├── types/
│   └── symbols.ts           # Core symbol classes & differentiation
├── lib/
│   ├── algebra.ts           # Simplification, equations, matrices
│   └── render.ts            # Beautiful math renderer
├── index.ts                 # Main exports
└── main.ts                  # Usage examples
```

### Building from Source

```bash
git clone https://github.com/uriel-flame-of-god/SympJS
cd SympJS
npm install
npm run dev      # Start development server
npm run build    # Build for production
npm run test     # Run tests
```

### Directory Overview
- `src/types/symbols.ts` - Symbolic computation engine with differentiation rules
- `src/lib/algebra.ts` - Advanced algebra: simplification, equation solving, linear algebra
- `src/lib/render.ts` - Mathematical expression rendering with beautiful typography
- `index.html` - Demo page with math containers
- `src/main.ts` - Comprehensive test suite demonstrating all features

## ✅ Tested Features

### Simplification ✓
- Identity elimination (0, 1 operations)
- Zero multiplication removal
- Power simplification (x^0, x^1)
- Like term combination
- Constant computation
- Complex nested expression simplification

### Equation Solving ✓
- Linear equations with correct solutions
- Quadratic equations with quadratic formula
- Multiple root detection
- No real solution handling

### Matrix Operations ✓
- MxN matrix support (tested: 2x3, 3x2, 2x2, 3x3)
- Scalar multiplication
- Matrix addition & subtraction
- Matrix multiplication with dimension validation
- Matrix-vector multiplication
- Transpose (MxN → NxM)
- Determinant calculation (2x2, 3x3)
- Matrix inverse with identity verification
- Gaussian elimination for system solving (2x2, 3x3)

### Rendering ✓
- Auto-container detection with `app-type="math"`
- Symbolic expression rendering
- Mathematical symbol support
- Responsive design
- Dark mode support

## 🎯 Roadmap

- [x] Algebraic simplification engine
- [x] Equation solving system
- [x] Matrix operations and linear algebra
- [ ] Symbolic integration capabilities
- [ ] LaTeX import/export
- [ ] Limit computation
- [ ] Series expansion (Taylor, Fourier)
- [ ] Complex number support
- [ ] 3D mathematical plotting
- [ ] Polynomial factorization
- [ ] Trigonometric simplification

## 🤝 Contributing

We welcome contributions! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
6. Report bugs or suggest features in [GitHub Issues](https://github.com/uriel-flame-of-god/SympJS/issues)

## 📄 License

MIT License - see [LICENSE](https://github.com/uriel-flame-of-god/SympJS/blob/main/LICENSE) file for details.

## 🔗 Links

- **NPM Package**: [@auriel/sympjs](https://www.npmjs.com/package/@auriel/sympjs)
- **GitHub Repository**: [SympJS](https://github.com/uriel-flame-of-god/SympJS)
- **Issues & Bugs**: [GitHub Issues](https://github.com/uriel-flame-of-god/SympJS/issues)
- **Author**: [Debaditya Malakar](https://github.com/uriel-flame-of-god)

## 🙏 Acknowledgments

Inspired by SymPy and other computer algebra systems. Mathematical rendering uses professional typography with support for STIX, Cambria Math, and Latin Modern Math fonts.

---

**@auriel/sympjs** - Bringing the elegance of symbolic mathematics to TypeScript! 🧮✨

*Making advanced mathematics accessible and beautiful on the web.*