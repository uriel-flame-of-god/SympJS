//src/main.ts
import { symbols, diff, Constant } from "./types/symbols";
import { Render } from "./lib/render";
import { Simplifier, EquationSolver, Matrix } from "./lib/algebra";

window.addEventListener("DOMContentLoaded", () => {
    const renderer = new Render();

    console.log("=".repeat(80));
    console.log("ALGEBRAIC SIMPLIFICATION ENGINE EXAMPLES");
    console.log("=".repeat(80));

    // Create symbolic variables
    const [x, y, z] = symbols('x', 'y', 'z');

    // ============================================
    // 1. SIMPLIFICATION EXAMPLES
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
});