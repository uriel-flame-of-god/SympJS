//src/main.ts
import { symbols, Constant, int, SymbolicExpression } from "./types/symbols";
import { Render } from "./lib/render";
import { Simplifier, EquationSolver, Matrix } from "./lib/algebra";
import { Complex, ComplexConstants } from "./types/complex";
import { TaylorSeries } from "./lib/taylor";
import { FourierSeries, FourierUtils } from "./lib/fourier";
import { sin, cos, tan, cot, sec, csc, asin, acos, atan, simplifyTrig, pi } from "./types/trigonometry";

window.addEventListener("DOMContentLoaded", () => {
    const renderer = new Render();

    console.log("=".repeat(80));
    console.log("ALGEBRAIC SIMPLIFICATION ENGINE EXAMPLES");
    console.log("=".repeat(80));

    // Create symbolic variables
    const [x, y] = symbols('x', 'y');

    // ============================================
    // 1. INTEGRATION EXAMPLES
    console.log('\n1. INTEGRATION EXAMPLES');
    console.log('='.repeat(40));
    
    // Basic integration examples
    console.log('∫1 dx =', int(new Constant(1), x).toString());
    console.log('∫x dx =', int(x, x).toString());
    console.log('∫x^2 dx =', int(x.pow(2), x).toString());
    
    // Definite integral
    const zero = new Constant(0);
    const one = new Constant(1);
    console.log('∫[0,1] x^2 dx =', int(x.pow(2), x, zero, one).toString());
    
    // Linearity of integration
    const linearExpr = x.add(x.pow(2));
    console.log(`∫(${linearExpr}) dx =`, int(linearExpr, x).toString());
    
    // Constant multiple rule
    const constMultipleExpr = new Constant(3).mul(x.pow(2));
    console.log(`∫(${constMultipleExpr}) dx =`, int(constMultipleExpr, x).toString());

    // ============================================
    // 2. SIMPLIFICATION EXAMPLES
    // ============================================
    console.log("\n--- SIMPLIFICATION TESTS ---\n");

    // Test 1: y^2 + 3*y + y*0 → y^2 + 3*y
    const expr1 = y.pow(2).add(y.mul(3)).add(y.mul(0));
    console.log(`Original: ${expr1}`);
    const simplified1 = Simplifier.simplify(expr1);
    console.log(`Simplified: ${simplified1}`);
    renderer.renderSymbolic(simplified1, 'math-container-1');

    // Test 2: x + 0 → x
    const expr2 = x.add(0);
    console.log(`\nOriginal: ${expr2}`);
    const simplified2 = Simplifier.simplify(expr2);
    console.log(`Simplified: ${simplified2}`);

    // Test 3: 2 * x * 1 → 2*x
    const expr3 = new Constant(2).mul(x).mul(1);
    console.log(`\nOriginal: ${expr3}`);
    const simplified3 = Simplifier.simplify(expr3);
    console.log(`Simplified: ${simplified3}`);

    // Test 4: (x + x) + 3 → 2*x + 3
    const expr4 = x.add(x).add(3);
    console.log(`\nOriginal: ${expr4}`);
    const simplified4 = Simplifier.simplify(expr4);
    console.log(`Simplified: ${simplified4}`);
    renderer.renderSymbolic(simplified4, 'math-container-2');

    // Test 5: x / x → 1
    const expr5 = x.div(x);
    console.log(`\nOriginal: ${expr5}`);
    const simplified5 = Simplifier.simplify(expr5);
    console.log(`Simplified: ${simplified5}`);

    // Test 6: x^0 → 1
    const expr6 = x.pow(0);
    console.log(`\nOriginal: ${expr6}`);
    const simplified6 = Simplifier.simplify(expr6);
    console.log(`Simplified: ${simplified6}`);

    // Test 7: x^1 → x
    const expr7 = x.pow(1);
    console.log(`\nOriginal: ${expr7}`);
    const simplified7 = Simplifier.simplify(expr7);
    console.log(`Simplified: ${simplified7}`);

    // Test 8: (x * y) + 0 → x * y
    const expr8 = x.mul(y).add(0);
    console.log(`\nOriginal: ${expr8}`);
    const simplified8 = Simplifier.simplify(expr8);
    console.log(`Simplified: ${simplified8}`);

    // Test 9: Complex: ((x + x) * 2) - x → 3*x
    const expr9 = x.add(x).mul(2).sub(x);
    console.log(`\nOriginal: ${expr9}`);
    const simplified9 = Simplifier.simplify(expr9);
    console.log(`Simplified: ${simplified9}`);
    renderer.renderSymbolic(simplified9, 'math-container-3');

    // ============================================
    // 2. EQUATION SOLVING EXAMPLES
    // ============================================
    console.log("\n" + "=".repeat(80));
    console.log("EQUATION SOLVING EXAMPLES");
    console.log("=".repeat(80));
    console.log("\n--- LINEAR EQUATION TESTS ---\n");

    // Linear: 2x + 4 = 0
    const linear1 = x.mul(2).add(4);
    const sol_linear1 = EquationSolver.solveLinear(linear1, x);
    console.log(`Equation: 2*x + 4 = 0`);
    console.log(`Solution: x = ${sol_linear1}`); // Should be -2

    // Linear: 3x - 9 = 0
    const linear2 = x.mul(3).sub(9);
    const sol_linear2 = EquationSolver.solveLinear(linear2, x);
    console.log(`\nEquation: 3*x - 9 = 0`);
    console.log(`Solution: x = ${sol_linear2}`); // Should be 3

    console.log("\n--- QUADRATIC EQUATION TESTS ---\n");

    // Quadratic: x^2 - 5*x + 6 = 0 (roots: 2, 3)
    const quad1 = x.pow(2).sub(x.mul(5)).add(6);
    const sol_quad1 = EquationSolver.solveQuadratic(quad1, x);
    console.log(`Equation: x^2 - 5*x + 6 = 0`);
    console.log(`Solutions: ${sol_quad1 ? `x = ${sol_quad1[0].toFixed(2)}, ${sol_quad1[1].toFixed(2)}` : 'No real solutions'}`);

    // Quadratic: x^2 + 2*x + 1 = 0 (roots: -1, -1)
    const quad2 = x.pow(2).add(x.mul(2)).add(1);
    const sol_quad2 = EquationSolver.solveQuadratic(quad2, x);
    console.log(`\nEquation: x^2 + 2*x + 1 = 0`);
    console.log(`Solutions: ${sol_quad2 ? `x = ${sol_quad2[0].toFixed(2)}, ${sol_quad2[1].toFixed(2)}` : 'No real solutions'}`);

    // Quadratic: x^2 + 1 = 0 (no real roots)
    const quad3 = x.pow(2).add(1);
    const sol_quad3 = EquationSolver.solveQuadratic(quad3, x);
    console.log(`\nEquation: x^2 + 1 = 0`);
    console.log(`Solutions: ${sol_quad3 ? `x = ${sol_quad3[0].toFixed(2)}, ${sol_quad3[1].toFixed(2)}` : 'No real solutions'}`);

    // ============================================
    // 3. MATRIX OPERATIONS - MxN MATRICES
    // ============================================
    console.log("\n" + "=".repeat(80));
    console.log("MATRIX OPERATIONS (MxN SUPPORT)");
    console.log("=".repeat(80));

    console.log("\n--- MATRIX CREATION & BASIC OPERATIONS ---\n");

    // 2x3 matrix
    const A = new Matrix([
        [1, 2, 3],
        [4, 5, 6]
    ]);
    console.log("Matrix A (2x3):");
    console.log(A.toString());
    console.log(`Shape: ${A.shape()}`);

    // 3x2 matrix
    const B = new Matrix([
        [1, 2],
        [3, 4],
        [5, 6]
    ]);
    console.log("\nMatrix B (3x2):");
    console.log(B.toString());
    console.log(`Shape: ${B.shape()}`);

    // 2x2 square matrix
    const C = new Matrix([
        [1, 2],
        [3, 4]
    ]);
    console.log("\nMatrix C (2x2):");
    console.log(C.toString());

    // 2x2 square matrix
    const D = new Matrix([
        [5, 6],
        [7, 8]
    ]);
    console.log("\nMatrix D (2x2):");
    console.log(D.toString());

    console.log("\n--- SCALAR OPERATIONS ---\n");

    // Scalar multiplication
    const C_scaled = C.scalarMultiply(2);
    console.log("C * 2 (Scalar multiplication):");
    console.log(C_scaled.toString());

    console.log("\n--- ADDITION & SUBTRACTION ---\n");

    // Matrix addition
    const sum = C.add(D);
    console.log("C + D (Addition):");
    console.log(sum.toString());

    // Matrix subtraction
    const diff_mat = C.subtract(D);
    console.log("\nC - D (Subtraction):");
    console.log(diff_mat.toString());

    console.log("\n--- MATRIX MULTIPLICATION ---\n");

    // A (2x3) * B (3x2) = Result (2x2)
    const product_AB = A.multiply(B);
    console.log("A (2x3) * B (3x2) = Result (2x2):");
    console.log(product_AB.toString());

    // C (2x2) * D (2x2) = Result (2x2)
    const product_CD = C.multiply(D);
    console.log("\nC (2x2) * D (2x2):");
    console.log(product_CD.toString());

    console.log("\n--- VECTOR OPERATIONS ---\n");

    // Matrix-vector multiplication
    const vector = [1, 2, 3];
    const result_vec = A.multiplyVector(vector);
    console.log(`A (2x3) * v (3x1) where v = [${vector.join(', ')}]:`);
    console.log(`Result: [${result_vec.map(v => v.toFixed(2)).join(', ')}]`);

    const vector2 = [2, 3];
    const result_vec2 = C.multiplyVector(vector2);
    console.log(`\nC (2x2) * w (2x1) where w = [${vector2.join(', ')}]:`);
    console.log(`Result: [${result_vec2.map(v => v.toFixed(2)).join(', ')}]`);

    console.log("\n--- TRANSPOSE ---\n");

    // Transpose of 2x3 matrix
    const A_T = A.transpose();
    console.log("A^T (transpose of 2x3 → 3x2):");
    console.log(A_T.toString());

    const C_T = C.transpose();
    console.log("\nC^T (transpose of 2x2):");
    console.log(C_T.toString());

    console.log("\n--- DETERMINANT (Square Matrices Only) ---\n");

    // 2x2 determinant
    const det_C = C.determinant();
    console.log(`det(C) where C = [[1, 2], [3, 4]]: ${det_C.toFixed(4)}`);

    // 3x3 determinant
    const E = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 10]
    ]);
    const det_E = E.determinant();
    console.log(`det(E) where E = [[1,2,3], [4,5,6], [7,8,10]]: ${det_E.toFixed(4)}`);

    console.log("\n--- MATRIX INVERSE ---\n");

    // Inverse of 2x2
    const C_inv = C.inverse();
    console.log("C^(-1) (inverse of C):");
    console.log(C_inv.toString());

    // Verify: C * C^(-1) ≈ I
    const identity = C.multiply(C_inv);
    console.log("\nVerification: C * C^(-1) (should be identity):");
    console.log(identity.toString());

    // 3x3 inverse
    const E_inv = E.inverse();
    console.log("\nE^(-1) (inverse of 3x3 E):");
    console.log(E_inv.toString());

    console.log("\n--- SOLVING LINEAR SYSTEMS (Gaussian Elimination) ---\n");

    // Solve Ax = b where A = [[2, 1], [1, 3]], b = [5, 4]
    // Augmented matrix: [[2, 1, 5], [1, 3, 4]]
    const augmented = new Matrix([
        [2, 1, 5],
        [1, 3, 4]
    ]);
    const solution = augmented.gaussianElimination();
    console.log("Solve 2x + y = 5, x + 3y = 4:");
    console.log(`Solution: x = ${solution?.[0].toFixed(4)}, y = ${solution?.[1].toFixed(4)}`);

    // Another system: 3x + 2y + z = 11, x + y + z = 6, 2x + y - z = 3
    const augmented2 = new Matrix([
        [3, 2, 1, 11],
        [1, 1, 1, 6],
        [2, 1, -1, 3]
    ]);
    const solution2 = augmented2.gaussianElimination();
    console.log("\nSolve 3x + 2y + z = 11, x + y + z = 6, 2x + y - z = 3:");
    console.log(`Solution: x = ${solution2?.[0].toFixed(4)}, y = ${solution2?.[1].toFixed(4)}, z = ${solution2?.[2].toFixed(4)}`);

    console.log("\n" + "=".repeat(80));
    console.log("ALL TESTS COMPLETED");
    console.log("=".repeat(80));

    console.log("\n" + "=".repeat(80));
    
    console.log("COMPLEX NUMBER OPERATIONS");
    console.log("=".repeat(80));

    // Complex number examples
    const z1 = new Complex(3, 4);
    const z2 = new Complex(1, -2);

    console.log(`\nz1 = ${z1}`);
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

    console.log("\n" + "=".repeat(80));
    console.log("TAYLOR SERIES EXPANSIONS");
    console.log("=".repeat(80));

    // Taylor series examples
    const [x_taylor] = symbols('x');

    // Taylor series for e^x around 0
    console.log("\nTaylor series for e^x around 0 (first 6 terms):");
    const expCoeffs = TaylorSeries.expSeries(x_taylor, 5);
    const expPoly = TaylorSeries.toPolynomial(expCoeffs, x_taylor, 0);
    console.log(`Polynomial: ${expPoly}`);
    renderer.renderSymbolic(expPoly, 'math-container-4');

    // Taylor series for sin(x) around 0
    console.log("\nTaylor series for sin(x) around 0 (first 6 terms):");
    const sinCoeffs = TaylorSeries.sinSeries(x_taylor, 5);
    const sinPoly = TaylorSeries.toPolynomial(sinCoeffs, x_taylor, 0);
    console.log(`Polynomial: ${sinPoly}`);
    renderer.renderSymbolic(sinPoly, 'math-container-5');

    // Taylor series for cos(x) around 0
    console.log("\nTaylor series for cos(x) around 0 (first 6 terms):");
    const cosCoeffs = TaylorSeries.cosSeries(x_taylor, 5);
    const cosPoly = TaylorSeries.toPolynomial(cosCoeffs, x_taylor, 0);
    console.log(`Polynomial: ${cosPoly}`);
    renderer.renderSymbolic(cosPoly, 'math-container-6');

    // Custom function Taylor series
    console.log("\nTaylor series for custom function around 0:");
    const taylorCustomFunc = x_taylor.pow(2).add(x_taylor.mul(3)).add(1);
    const taylorCustomCoeffs = TaylorSeries.expand(taylorCustomFunc, x_taylor, 0, 3);
    const taylorCustomPoly = TaylorSeries.toPolynomial(taylorCustomCoeffs, x_taylor, 0);
    console.log(`Original: ${taylorCustomFunc}`);
    console.log(`Taylor polynomial: ${taylorCustomPoly}`);
    renderer.renderSymbolic(taylorCustomPoly, 'math-container-7');

    console.log("\n" + "=".repeat(80));
    console.log("FOURIER SERIES EXPANSIONS");
    console.log("=".repeat(80));

    // ============================================
    // 1. BASIC FOURIER SERIES EXAMPLES
    // ============================================
    console.log("\n--- BASIC FOURIER SERIES TESTS ---\n");

    // Test 1: Square wave Fourier series
    console.log("1. Square Wave Fourier Series:");
    const squareWave = FourierUtils.squareWave(1, 2 * Math.PI);
    console.log(`Number of harmonics: ${squareWave.getNumHarmonics()}`);
    console.log(`Period: ${squareWave.getPeriod()}`);
    console.log(`Fundamental frequency: ${squareWave.getFundamentalFrequency().toFixed(4)}`);
    
    // Evaluate square wave at various points
    const testPoints = [0, Math.PI/4, Math.PI/2, Math.PI, 3*Math.PI/2];
    console.log("\nSquare wave values:");
    testPoints.forEach(x => {
        const value = squareWave.evaluate(x);
        console.log(`f(${x.toFixed(2)}) = ${value.toFixed(4)}`);
    });

    // Test 2: Sawtooth wave Fourier series
    console.log("\n2. Sawtooth Wave Fourier Series:");
    const sawtoothWave = FourierUtils.sawtoothWave(1, 2 * Math.PI);
    console.log(`Number of harmonics: ${sawtoothWave.getNumHarmonics()}`);
    
    console.log("\nSawtooth wave values:");
    testPoints.forEach(x => {
        const value = sawtoothWave.evaluate(x);
        console.log(`f(${x.toFixed(2)}) = ${value.toFixed(4)}`);
    });

    // Test 3: Triangle wave Fourier series
    console.log("\n3. Triangle Wave Fourier Series:");
    const triangleWave = FourierUtils.triangleWave(1, 2 * Math.PI);
    console.log(`Number of harmonics: ${triangleWave.getNumHarmonics()}`);
    
    console.log("\nTriangle wave values:");
    testPoints.forEach(x => {
        const value = triangleWave.evaluate(x);
        console.log(`f(${x.toFixed(2)}) = ${value.toFixed(4)}`);
    });

    // ============================================
    // 2. CUSTOM FUNCTION FOURIER SERIES
    // ============================================
    console.log("\n--- CUSTOM FUNCTION FOURIER SERIES ---\n");

    // Test 4: Custom function f(x) = |x| on [-π, π] (absolute value)
    console.log("4. Custom Function f(x) = |x|:");
    const customSeries = new FourierSeries(2 * Math.PI);
    const fourierCustomFunc = (x: number) => Math.abs(x);
    customSeries.computeCoefficients(fourierCustomFunc, 5, 1000);
    
    console.log(`Computed ${customSeries.getNumHarmonics()} harmonics`);
    const coeffs = customSeries.getCoefficients() as any;
    console.log(`a0 = ${coeffs.a0.toFixed(4)}`);
    console.log("First few an coefficients:", coeffs.an.slice(0, 3).map((a: number) => a.toFixed(4)));
    console.log("First few bn coefficients:", coeffs.bn.slice(0, 3).map((b: number) => b.toFixed(4)));
    
    console.log("\nCustom function values:");
    testPoints.forEach(x => {
        const original = fourierCustomFunc(x);
        const approximation = customSeries.evaluate(x);
        const error = Math.abs(original - approximation);
        console.log(`x=${x.toFixed(2)}: f(x)=${original.toFixed(2)}, approx=${approximation.toFixed(2)}, error=${error.toFixed(4)}`);
    });

    // ============================================
    // 3. COMPLEX FOURIER SERIES
    // ============================================
    console.log("\n--- COMPLEX FOURIER SERIES ---\n");

    // Test 5: Complex Fourier series for f(x) = e^(ix)
    console.log("5. Complex Fourier Series for f(x) = e^(ix):");
    const complexSeries = new FourierSeries(2 * Math.PI);
    const complexFunc = (x: number) => new Complex(Math.cos(x), Math.sin(x));
    complexSeries.computeComplexCoefficients(complexFunc, 3, 500);
    
    console.log(`Computed ${complexSeries.getNumHarmonics()} harmonics`);
    
    // Get amplitude and phase spectrum
    const amplitudeSpectrum = complexSeries.getAmplitudeSpectrum();
    const phaseSpectrum = complexSeries.getPhaseSpectrum();
    
    console.log("\nAmplitude spectrum:");
    amplitudeSpectrum.forEach((amp, i) => {
        const n = i - Math.floor(amplitudeSpectrum.length / 2);
        console.log(`|c${n}| = ${amp.toFixed(4)}`);
    });
    
    console.log("\nPhase spectrum:");
    phaseSpectrum.forEach((phase, i) => {
        const n = i - Math.floor(phaseSpectrum.length / 2);
        console.log(`arg(c${n}) = ${phase.toFixed(4)} rad`);
    });
    
    // Evaluate complex series
    console.log("\nComplex series evaluation:");
    const complexTestPoints = [0, Math.PI/4, Math.PI/2];
    complexTestPoints.forEach(x => {
        const result = complexSeries.evaluateComplex(x);
        console.log(`f(${x.toFixed(2)}) = ${result}`);
    });

    // ============================================
    // 4. CONVERSION BETWEEN REAL AND COMPLEX
    // ============================================
    console.log("\n--- REAL TO COMPLEX CONVERSION ---\n");

    // Test 6: Convert real Fourier series to complex
    console.log("6. Converting real Fourier series to complex:");
    const realSeries = FourierUtils.squareWave(1, 2 * Math.PI);
    const complexCoeffs = realSeries.toComplexCoefficients();
    
    console.log(`Original real series has ${realSeries.getNumHarmonics()} harmonics`);
    console.log(`Converted complex series has ${complexCoeffs.cn.length} coefficients`);
    
    // Create complex series from converted coefficients
    const convertedSeries = FourierSeries.fromComplexCoefficients(complexCoeffs, 2 * Math.PI);
    console.log("\nVerification - comparing evaluations:");
    testPoints.forEach(x => {
        const realValue = realSeries.evaluate(x);
        const complexValue = convertedSeries.evaluateComplex(x);
        console.log(`x=${x.toFixed(2)}: real=${realValue.toFixed(4)}, complex=${complexValue}`);
    });

    // ============================================
    // 5. STATIC FACTORY METHODS
    // ============================================
    console.log("\n--- STATIC FACTORY METHODS ---\n");

    // Test 7: Create series from predefined coefficients
    console.log("7. Creating series from predefined coefficients:");
    const predefinedCoeffs = {
        a0: 0,
        an: [0, 0.5, 0, 0.25],
        bn: [0.8, 0, 0.4, 0]
    };
    const predefinedSeries = FourierSeries.fromCoefficients(predefinedCoeffs, Math.PI);
    console.log(`Created series with ${predefinedSeries.getNumHarmonics()} harmonics`);
    console.log(`Period: ${predefinedSeries.getPeriod()}`);
    
    console.log("\nPredefined series values:");
    const predefinedTestPoints = [0, Math.PI/4, Math.PI/2];
    predefinedTestPoints.forEach(x => {
        const value = predefinedSeries.evaluate(x);
        console.log(`f(${x.toFixed(2)}) = ${value.toFixed(4)}`);
    });

    // ============================================
    // 6. SERIES MANIPULATION
    // ============================================
    console.log("\n--- SERIES MANIPULATION ---\n");

    // Test 8: Clear and reset series
    console.log("8. Series manipulation:");
    const manipSeries = new FourierSeries();
    manipSeries.computeCoefficients(x => Math.sin(x), 3);
    console.log(`Initial harmonics: ${manipSeries.getNumHarmonics()}`);
    
    manipSeries.clear();
    console.log(`After clearing: ${manipSeries.getNumHarmonics()}`);
    
    manipSeries.setPeriod(Math.PI);
    console.log(`New period: ${manipSeries.getPeriod()}`);
    console.log(`New fundamental frequency: ${manipSeries.getFundamentalFrequency().toFixed(4)}`);

    console.log("\n" + "=".repeat(80));
    console.log("ALL MODULES TESTED SUCCESSFULLY");
    console.log("=".repeat(80));

    console.log("\n" + "=".repeat(80));
    console.log("TRIGONOMETRIC FUNCTIONS TESTS");
    console.log("=".repeat(80));

    // ============================================
    // 1. BASIC TRIGONOMETRIC FUNCTION TESTS
    // ============================================
    console.log("\n--- BASIC TRIGONOMETRIC FUNCTIONS ---\n");

    // Test 1: Basic trigonometric functions
    console.log("1. Basic Trigonometric Functions:");
    const sinExpr = sin(x);
    const cosExpr = cos(x);
    const tanExpr = tan(x);
    
    console.log(`sin(x) = ${sinExpr}`);
    console.log(`cos(x) = ${cosExpr}`);
    console.log(`tan(x) = ${tanExpr}`);
    renderer.renderSymbolic(sinExpr, 'math-container-8');
    renderer.renderSymbolic(cosExpr, 'math-container-9');
    renderer.renderSymbolic(tanExpr, 'math-container-10');

    // Test 2: Reciprocal functions
    console.log("\n2. Reciprocal Functions:");
    const cotExpr = cot(x);
    const secExpr = sec(x);
    const cscExpr = csc(x);
    
    console.log(`cot(x) = ${cotExpr}`);
    console.log(`sec(x) = ${secExpr}`);
    console.log(`csc(x) = ${cscExpr}`);
    renderer.renderSymbolic(cotExpr, 'math-container-11');
    renderer.renderSymbolic(secExpr, 'math-container-12');
    renderer.renderSymbolic(cscExpr, 'math-container-13');

    // Test 3: Inverse functions
    console.log("\n3. Inverse Functions:");
    const asinExpr = asin(x);
    const acosExpr = acos(x);
    const atanExpr = atan(x);
    
    console.log(`asin(x) = ${asinExpr}`);
    console.log(`acos(x) = ${acosExpr}`);
    console.log(`atan(x) = ${atanExpr}`);
    renderer.renderSymbolic(asinExpr, 'math-container-14');
    renderer.renderSymbolic(acosExpr, 'math-container-15');
    renderer.renderSymbolic(atanExpr, 'math-container-16');

    // ============================================
    // 2. COMMON ANGLE VALUES AND SIMPLIFICATION
    // ============================================
    console.log("\n--- COMMON ANGLE VALUES ---\n");

    // Test 4: Common angle simplification
    console.log("4. Common Angle Simplification:");
    
    // Test with π/6 (30°)
    const piOver6 = new SymbolicExpression([pi(), new Constant(6)], '/');
    const sin30 = simplifyTrig(sin(piOver6));
    const cos30 = simplifyTrig(cos(piOver6));
    const tan30 = simplifyTrig(tan(piOver6));
    
    console.log(`sin(π/6) = ${sin30}`);
    console.log(`cos(π/6) = ${cos30}`);
    console.log(`tan(π/6) = ${tan30}`);
    renderer.renderSymbolic(sin30, 'math-container-17');
    renderer.renderSymbolic(cos30, 'math-container-18');
    renderer.renderSymbolic(tan30, 'math-container-19');

    // Test with π/4 (45°)
    const piOver4 = new SymbolicExpression([pi(), new Constant(4)], '/');
    const sin45 = simplifyTrig(sin(piOver4));
    const cos45 = simplifyTrig(cos(piOver4));
    const tan45 = simplifyTrig(tan(piOver4));
    
    console.log(`\nsin(π/4) = ${sin45}`);
    console.log(`cos(π/4) = ${cos45}`);
    console.log(`tan(π/4) = ${tan45}`);
    renderer.renderSymbolic(sin45, 'math-container-20');
    renderer.renderSymbolic(cos45, 'math-container-21');
    renderer.renderSymbolic(tan45, 'math-container-22');

    // Test with π/3 (60°)
    const piOver3 = new SymbolicExpression([pi(), new Constant(3)], '/');
    const sin60 = simplifyTrig(sin(piOver3));
    const cos60 = simplifyTrig(cos(piOver3));
    const tan60 = simplifyTrig(tan(piOver3));
    
    console.log(`\nsin(π/3) = ${sin60}`);
    console.log(`cos(π/3) = ${cos60}`);
    console.log(`tan(π/3) = ${tan60}`);
    renderer.renderSymbolic(sin60, 'math-container-23');
    renderer.renderSymbolic(cos60, 'math-container-24');
    renderer.renderSymbolic(tan60, 'math-container-25');

    // Test with π/2 (90°)
    const piOver2 = new SymbolicExpression([pi(), new Constant(2)], '/');
    const sin90 = simplifyTrig(sin(piOver2));
    const cos90 = simplifyTrig(cos(piOver2));
    const tan90 = simplifyTrig(tan(piOver2));
    
    console.log(`\nsin(π/2) = ${sin90}`);
    console.log(`cos(π/2) = ${cos90}`);
    console.log(`tan(π/2) = ${tan90}`);
    renderer.renderSymbolic(sin90, 'math-container-26');
    renderer.renderSymbolic(cos90, 'math-container-27');

    // ============================================
    // 3. TRIGONOMETRIC IDENTITIES
    // ============================================
    console.log("\n--- TRIGONOMETRIC IDENTITIES ---\n");

    // Test 5: Pythagorean identity
    console.log("5. Pythagorean Identity:");
    const sinSquared = new SymbolicExpression([sin(x), new Constant(2)], '^');
    const cosSquared = new SymbolicExpression([cos(x), new Constant(2)], '^');
    const pythagorean = sinSquared.add(cosSquared);
    const simplifiedPythagorean = Simplifier.simplify(pythagorean);
    
    console.log(`sin²(x) + cos²(x) = ${simplifiedPythagorean}`);
    renderer.renderSymbolic(pythagorean, 'math-container-28');
    renderer.renderSymbolic(simplifiedPythagorean, 'math-container-29');

    // Test 6: Tangent identity
    console.log("\n6. Tangent Identity:");
    const tanIdentity = new SymbolicExpression([sin(x), cos(x)], '/');
    const simplifiedTan = Simplifier.simplify(tanIdentity);
    
    console.log(`sin(x)/cos(x) = ${simplifiedTan}`);
    renderer.renderSymbolic(tanIdentity, 'math-container-30');
    renderer.renderSymbolic(simplifiedTan, 'math-container-31');

    // ============================================
    // 4. TRIGONOMETRIC DIFFERENTIATION
    // ============================================
    console.log("\n--- TRIGONOMETRIC DIFFERENTIATION ---\n");

    // Test 7: Derivatives of trig functions
    console.log("7. Derivatives of Trigonometric Functions:");
    
    // Derivative of sin(x)
    const dSin = sinExpr.diff(x);
    console.log(`d/dx[sin(x)] = ${dSin}`);
    renderer.renderSymbolic(dSin, 'math-container-32');

    // Derivative of cos(x)
    const dCos = cosExpr.diff(x);
    console.log(`d/dx[cos(x)] = ${dCos}`);
    renderer.renderSymbolic(dCos, 'math-container-33');

    // Derivative of tan(x)
    const dTan = tanExpr.diff(x);
    console.log(`d/dx[tan(x)] = ${dTan}`);
    renderer.renderSymbolic(dTan, 'math-container-34');

    // Test 8: Chain rule with trig functions
    console.log("\n8. Chain Rule with Trigonometric Functions:");
    
    // Derivative of sin(2x)
    const sin2x = sin(x.mul(2));
    const dSin2x = sin2x.diff(x);
    console.log(`d/dx[sin(2x)] = ${dSin2x}`);
    renderer.renderSymbolic(sin2x, 'math-container-35');
    renderer.renderSymbolic(dSin2x, 'math-container-36');

    // Derivative of cos(x²)
    const cosXSquared = cos(x.pow(2));
    const dCosXSquared = cosXSquared.diff(x);
    console.log(`d/dx[cos(x²)] = ${dCosXSquared}`);
    renderer.renderSymbolic(cosXSquared, 'math-container-37');
    renderer.renderSymbolic(dCosXSquared, 'math-container-38');

    // ============================================
    // 5. COMPLEX TRIGONOMETRIC EXPRESSIONS
    // ============================================
    console.log("\n--- COMPLEX TRIGONOMETRIC EXPRESSIONS ---\n");

    // Test 9: Complex expressions
    console.log("9. Complex Trigonometric Expressions:");
    
    // Expression: sin(x) + cos(x)
    const sinPlusCos = sin(x).add(cos(x));
    console.log(`sin(x) + cos(x) = ${sinPlusCos}`);
    renderer.renderSymbolic(sinPlusCos, 'math-container-39');

    // Expression: tan(x) * sec(x)
    const tanTimesSec = tan(x).mul(sec(x));
    console.log(`tan(x) * sec(x) = ${tanTimesSec}`);
    renderer.renderSymbolic(tanTimesSec, 'math-container-40');

    // Expression: sin²(x) - cos²(x)
    const sinSquaredMinusCosSquared = sinSquared.sub(cosSquared);
    console.log(`sin²(x) - cos²(x) = ${sinSquaredMinusCosSquared}`);
    renderer.renderSymbolic(sinSquaredMinusCosSquared, 'math-container-41');

    console.log("\n" + "=".repeat(80));
    console.log("TRIGONOMETRIC FUNCTIONS TESTED SUCCESSFULLY");
    console.log("=".repeat(80));
});