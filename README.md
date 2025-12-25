# @auriel/sympjs - Symbolic Mathematics in TypeScript

[![npm version](https://img.shields.io/npm/v/@auriel/sympjs.svg)](https://www.npmjs.com/package/@auriel/sympjs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive TypeScript library for symbolic mathematics inspired by SymPy, providing symbolic computation, automatic differentiation, algebraic simplification, equation solving, Fourier series, trigonometric functions, integration, and beautiful mathematical rendering.

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

### Complex Numbers & Series
- **Complex Number Support**: Full complex arithmetic with imaginary unit `i`
  - Complex addition, subtraction, multiplication, division
  - Magnitude and phase calculations
  - Complex conjugation
  - Built-in constants: `i`, `0`, `1`

- **Taylor Series Expansion**: Symbolic Taylor series for functions
  - Expand functions around any point
  - Configurable number of terms
  - Built-in expansions for common functions (`e^x`, `sin(x)`, `cos(x)`)
  - Custom function expansion support

- **Fourier Series Expansion**: Complete Fourier analysis capabilities
  - Real and complex Fourier series
  - Common waveforms: square wave, sawtooth wave, triangle wave
  - Custom function Fourier series computation
  - Amplitude and phase spectrum analysis
  - Numerical integration using Simpson's rule
  - Conversion between real and complex representations

### Calculus Operations
- **Symbolic Integration**: Basic integration capabilities
  - Power rule integration
  - Linearity of integration
  - Constant multiple rule
  - Integration by parts (basic)
  - Definite integrals with bounds
  - Support for integral notation

- **Trigonometric Functions**: Complete trigonometric system
  - All six trigonometric functions: `sin`, `cos`, `tan`, `cot`, `sec`, `csc`
  - Inverse trigonometric functions: `asin`, `acos`, `atan`
  - Symbolic differentiation of trigonometric functions
  - Common angle simplification (30°, 45°, 60°, 90°)
  - Trigonometric identities and simplification
  - Chain rule support for composite trigonometric functions

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

### Integration

```typescript
import { int, symbols, Constant } from '@auriel/sympjs';

const [x] = symbols('x');
const zero = new Constant(0);
const one = new Constant(1);

// Basic integration
int(new Constant(1), x);            // ∫1 dx = x
int(x, x);                          // ∫x dx = (1/2)x²
int(x.pow(2), x);                   // ∫x² dx = (1/3)x³

// Definite integrals
int(x.pow(2), x, zero, one);        // ∫[0,1] x² dx

// Linearity of integration
const linearExpr = x.add(x.pow(2));
int(linearExpr, x);                 // ∫(x + x²) dx = (1/2)x² + (1/3)x³

// Constant multiple rule
const constMultipleExpr = new Constant(3).mul(x.pow(2));
int(constMultipleExpr, x);          // ∫3x² dx = x³
```

### Trigonometric Functions

```typescript
import { sin, cos, tan, cot, sec, csc, asin, acos, atan, simplifyTrig, pi, symbols } from '@auriel/sympjs';

const [x] = symbols('x');

// Basic trigonometric functions
const sinExpr = sin(x);
const cosExpr = cos(x);
const tanExpr = tan(x);
const cotExpr = cot(x);
const secExpr = sec(x);
const cscExpr = csc(x);

// Inverse trigonometric functions
const asinExpr = asin(x);
const acosExpr = acos(x);
const atanExpr = atan(x);

// Common angle simplification
const sin30 = simplifyTrig(sin(pi().div(6)));    // sin(π/6) → 1/2
const cos45 = simplifyTrig(cos(pi().div(4)));    // cos(π/4) → √2/2
const tan60 = simplifyTrig(tan(pi().div(3)));    // tan(π/3) → √3

// Trigonometric identities
const pythagorean = sin(x).pow(2).add(cos(x).pow(2));
const simplified = simplifyTrig(pythagorean);    // sin²(x) + cos²(x) → 1

// Derivatives of trig functions
sinExpr.diff(x);     // cos(x)
cosExpr.diff(x);     // -sin(x)
tanExpr.diff(x);     // sec²(x)
asinExpr.diff(x);    // 1/√(1 - x²)

// Chain rule examples
sin(x.mul(2)).diff(x);      // 2cos(2x)
cos(x.pow(2)).diff(x);      // -2x sin(x²)
```

### Fourier Series

```typescript
import { FourierSeries, FourierUtils } from '@auriel/sympjs';

// Common waveforms
const squareWave = FourierUtils.squareWave(1, 2 * Math.PI);
const sawtoothWave = FourierUtils.sawtoothWave(1, 2 * Math.PI);
const triangleWave = FourierUtils.triangleWave(1, 2 * Math.PI);

// Evaluate waveforms
squareWave.evaluate(0);           // Value at x=0
squareWave.evaluate(Math.PI/4);   // Value at x=π/4

// Get coefficients
const coeffs = squareWave.getCoefficients();
console.log(`a0 = ${coeffs.a0}`);
console.log(`First an: ${coeffs.an.slice(0, 3)}`);
console.log(`First bn: ${coeffs.bn.slice(0, 3)}`);

// Create custom Fourier series
const customSeries = new FourierSeries(2 * Math.PI);
const customFunc = (x: number) => Math.abs(x);  // f(x) = |x|
customSeries.computeCoefficients(customFunc, 5, 1000); // 5 harmonics

// Complex Fourier series
const complexSeries = new FourierSeries(2 * Math.PI);
const complexFunc = (x: number) => new Complex(Math.cos(x), Math.sin(x)); // e^(ix)
complexSeries.computeComplexCoefficients(complexFunc, 3, 500);

// Get amplitude and phase spectrum
const amplitude = complexSeries.getAmplitudeSpectrum();
const phase = complexSeries.getPhaseSpectrum();

// Convert real to complex coefficients
const complexCoeffs = squareWave.toComplexCoefficients();
const complexFromReal = FourierSeries.fromComplexCoefficients(complexCoeffs, 2 * Math.PI);
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

### Complex Numbers

```typescript
import { Complex } from '@auriel/sympjs';

// Create complex numbers
const z1 = new Complex(3, 4);        // 3 + 4i
const z2 = new Complex(1, -2);       // 1 - 2i

// Basic arithmetic
const sum = z1.add(z2);              // 4 + 2i
const product = z1.multiply(z2);     // 11 - 2i
const quotient = z1.divide(z2);      // -1 + 2i

// Properties and functions
const magnitude = z1.magnitude();    // 5.0000
const phase = z1.phase();            // 0.9273 radians
const conjugate = z1.conjugate();    // 3 - 4i

// Built-in constants
const i = ComplexConstants.I;                 // 0 + 1i
const zero = ComplexConstants.ZERO;           // 0 + 0i
const one = ComplexConstants.ONE;             // 1 + 0i

// String representation
console.log(z1.toString());          // "3 + 4i"
```

### Taylor Series

```typescript
import { TaylorSeries, symbols } from '@auriel/sympjs';

const [x] = symbols('x');

// Taylor series for common functions
const expSeries = TaylorSeries.exp(x, 0, 6);     // e^x around 0, 6 terms
const sinSeries = TaylorSeries.sin(x, 0, 6);     // sin(x) around 0, 6 terms
const cosSeries = TaylorSeries.cos(x, 0, 6);     // cos(x) around 0, 6 terms

// Custom function expansion
const customFunc = x.pow(2).add(x.mul(3)).add(1);
const customSeries = TaylorSeries.expand(customFunc, x, 0, 3);

// Display results
console.log(`e^x ≈ ${expSeries}`);
console.log(`sin(x) ≈ ${sinSeries}`);
console.log(`cos(x) ≈ ${cosSeries}`);
console.log(`Custom function: ${customSeries}`);
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
- **Complex numbers**: `i` (imaginary unit)

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
import { symbols, diff, int, Simplifier, Render } from '@auriel/sympjs';

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

// Integration examples
const integral1 = int(x.pow(3), x);  // (1/4)x⁴
const integral2 = int(sin(x), x);    // -cos(x)
renderer.renderSymbolic(integral1, 'integral-1');
renderer.renderSymbolic(integral2, 'integral-2');
```

### Fourier Series Examples

```typescript
import { FourierSeries, FourierUtils, Render } from '@auriel/sympjs';

const renderer = new Render();

// Square wave analysis
const squareWave = FourierUtils.squareWave(1, 2 * Math.PI);
console.log(`Square wave has ${squareWave.getNumHarmonics()} harmonics`);
console.log(`Period: ${squareWave.getPeriod()}`);

// Evaluate at different points
const points = [0, Math.PI/4, Math.PI/2, Math.PI];
points.forEach(x => {
    const value = squareWave.evaluate(x);
    console.log(`f(${x.toFixed(2)}) = ${value.toFixed(4)}`);
});

// Custom function Fourier series
const customSeries = new FourierSeries(Math.PI);
const triangleFunc = (x: number) => Math.abs(x);  // Triangle wave
customSeries.computeCoefficients(triangleFunc, 5, 1000);

// Complex Fourier series
const complexSeries = new FourierSeries(2 * Math.PI);
const complexFunc = (x: number) => new Complex(Math.cos(x), Math.sin(x));
complexSeries.computeComplexCoefficients(complexFunc, 3, 500);

// Get frequency spectrum
const amplitudes = complexSeries.getAmplitudeSpectrum();
const phases = complexSeries.getPhaseSpectrum();
console.log('Amplitude spectrum:', amplitudes.map(a => a.toFixed(4)));
```

### Trigonometric Examples

```typescript
import { symbols, sin, cos, tan, simplifyTrig, pi, diff, Render } from '@auriel/sympjs';

const [x] = symbols('x');
const renderer = new Render();

// Common angle simplification
const angles = {
    'π/6': pi().div(6),
    'π/4': pi().div(4), 
    'π/3': pi().div(3),
    'π/2': pi().div(2)
};

Object.entries(angles).forEach(([name, angle]) => {
    const sinVal = simplifyTrig(sin(angle));
    const cosVal = simplifyTrig(cos(angle));
    const tanVal = simplifyTrig(tan(angle));
    
    console.log(`${name}: sin = ${sinVal}, cos = ${cosVal}, tan = ${tanVal}`);
    renderer.renderSymbolic(sinVal, `sin-${name}`);
    renderer.renderSymbolic(cosVal, `cos-${name}`);
    renderer.renderSymbolic(tanVal, `tan-${name}`);
});

// Trigonometric differentiation chain rule
const compositeFunc = sin(x.pow(2).add(1));
const derivative = compositeFunc.diff(x);
console.log(`d/dx[sin(x² + 1)] = ${derivative}`);
renderer.renderSymbolic(derivative, 'trig-derivative');

// Trigonometric identities
const identity1 = sin(x).pow(2).add(cos(x).pow(2));
const simplifiedId = simplifyTrig(identity1);
console.log(`sin²(x) + cos²(x) = ${simplifiedId}`);
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

### Complex Number & Taylor Series Examples

```typescript
import { Complex, TaylorSeries, symbols, Render } from '@auriel/sympjs';

const [x] = symbols('x');
const renderer = new Render();

// Complex number operations
const z1 = new Complex(3, 4);
const z2 = new Complex(1, -2);

console.log(`z1 = ${z1}`);
console.log(`z2 = ${z2}`);
console.log(`Magnitude of z1: ${z1.magnitude().toFixed(4)}`);
console.log(`Phase of z1: ${z1.phase().toFixed(4)} radians`);

const zSum = z1.add(z2);
console.log(`\nz1 + z2 = ${zSum}`);

const zProduct = z1.multiply(z2);
console.log(`z1 * z2 = ${zProduct}`);

const zQuotient = z1.divide(z2);
console.log(`z1 / z2 = ${zQuotient}`);

const zConjugate = z1.conjugate();
console.log(`Conjugate of z1: ${zConjugate}`);

console.log(`\nComplex constants:`);
console.log(`i = ${ComplexConstants.I}`);
console.log(`0 = ${ComplexConstants.ZERO}`);
console.log(`1 = ${ComplexConstants.ONE}`);

// Taylor series expansions
const expApprox = TaylorSeries.exp(x, 0, 6);
const sinApprox = TaylorSeries.sin(x, 0, 6);
const cosApprox = TaylorSeries.cos(x, 0, 6);

renderer.renderSymbolic(expApprox, 'taylor-exp');
renderer.renderSymbolic(sinApprox, 'taylor-sin');
renderer.renderSymbolic(cosApprox, 'taylor-cos');

console.log(`\ne^x ≈ ${expApprox}`);
console.log(`sin(x) ≈ ${sinApprox}`);
console.log(`cos(x) ≈ ${cosApprox}`);
```

### Educational Tool

```typescript
import { symbols, diff, int, Simplifier, Render, TaylorSeries, FourierUtils } from '@auriel/sympjs';

const [x] = symbols('x');
const renderer = new Render();

// Demonstrate calculus rules
const functions = [
  { name: 'Power', expr: x.pow(2) },
  { name: 'Product', expr: x.mul(x.add(1)) },
  { name: 'Quotient', expr: x.div(x.add(1)) },
  { name: 'Complex', expr: x.pow(3).add(x.mul(2)) }
];

functions.forEach((fn, i) => {
  const derivative = Simplifier.simplify(diff(fn.expr, x));
  const integral = int(fn.expr, x);
  const taylor = TaylorSeries.expand(fn.expr, x, 0, 4);
  
  renderer.renderSymbolic(fn.expr, `func-${i}`);
  renderer.renderSymbolic(derivative, `deriv-${i}`);
  renderer.renderSymbolic(integral, `integral-${i}`);
  renderer.renderSymbolic(taylor, `taylor-${i}`);
  
  console.log(`${fn.name}: ${fn.expr} → d/dx: ${derivative}, ∫: ${integral}`);
});

// Fourier analysis demo
const squareWave = FourierUtils.squareWave(1, 2 * Math.PI);
const triangleWave = FourierUtils.triangleWave(1, 2 * Math.PI);
const sawtoothWave = FourierUtils.sawtoothWave(1, 2 * Math.PI);

const waveforms = [
  { name: 'Square Wave', wave: squareWave },
  { name: 'Triangle Wave', wave: triangleWave },
  { name: 'Sawtooth Wave', wave: sawtoothWave }
];

waveforms.forEach((wf, i) => {
  console.log(`${wf.name}:`);
  console.log(`  Harmonics: ${wf.wave.getNumHarmonics()}`);
  console.log(`  Period: ${wf.wave.getPeriod()}`);
  
  const testPoint = Math.PI / 2;
  const value = wf.wave.evaluate(testPoint);
  console.log(`  f(π/2) = ${value.toFixed(4)}`);
});
```

## 🛠️ Development

### Project Structure
```
src/
├── types/
│   ├── symbols.ts           # Core symbol classes & differentiation
│   ├── complex.ts           # Complex number implementation
│   └── trigonometry.ts      # Trigonometric functions and identities
├── lib/
│   ├── algebra.ts           # Simplification, equations, matrices
│   ├── taylor.ts            # Taylor series expansion
│   ├── fourier.ts           # Fourier series expansion
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
- `src/types/symbols.ts` - Symbolic computation engine with differentiation and integration rules
- `src/types/complex.ts` - Complex number arithmetic and operations
- `src/types/trigonometry.ts` - Trigonometric functions, identities, and simplification
- `src/lib/algebra.ts` - Advanced algebra: simplification, equation solving, linear algebra
- `src/lib/taylor.ts` - Taylor series expansion for functions
- `src/lib/fourier.ts` - Fourier series analysis and synthesis
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

### Complex Numbers ✓
- Complex arithmetic (addition, subtraction, multiplication, division)
- Magnitude and phase calculations
- Complex conjugation
- Built-in constants (i, 0, 1)
- String representation

### Taylor Series ✓
- Exponential function expansion (e^x)
- Trigonometric function expansion (sin(x), cos(x))
- Custom function expansion
- Configurable expansion point and number of terms
- Symbolic polynomial generation

### Fourier Series ✓
- Real Fourier series computation
- Complex Fourier series computation
- Common waveform generation (square, sawtooth, triangle)
- Numerical integration with Simpson's rule
- Amplitude and phase spectrum analysis
- Real-to-complex coefficient conversion

### Trigonometric Functions ✓
- All six trigonometric functions (sin, cos, tan, cot, sec, csc)
- Inverse trigonometric functions (asin, acos, atan)
- Common angle simplification (30°, 45°, 60°, 90°)
- Symbolic differentiation with chain rule
- Trigonometric identity application
- Exact value computation for special angles

### Integration ✓
- Basic power rule integration
- Linearity and constant multiple rules
- Definite integrals with bounds
- Integration by parts (basic)
- Integral expression representation

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
- [x] Complex number support
- [x] Series expansion (Taylor)
- [x] Symbolic integration capabilities
- [ ] LaTeX import/export
- [ ] Limit computation
- [x] Fourier series expansion
- [ ] 3D mathematical plotting
- [ ] Polynomial factorization
- [x] Trigonometric simplification
- [ ] Graph theory integration
- [ ] Statistics and probability functions

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
