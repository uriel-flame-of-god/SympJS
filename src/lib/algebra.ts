//src/lib/algebra.ts

import { Symbols, SymbolicExpression, Constant } from '../types/symbols';

/**
 * Advanced Algebraic Simplification Engine
 * Handles complex symbolic expressions with smart rule application
 */
class Simplifier {
    /**
     * Simplify a symbolic expression with maximum iterations
     */
    static simplify(expr: Symbols, maxIterations: number = 10): Symbols {
        let current = expr;
        let iterations = 0;

        while (iterations < maxIterations) {
            const simplified = this.applyAllRules(current);
            
            if (simplified.toString() === current.toString()) {
                break;
            }
            
            current = simplified;
            iterations++;
        }

        return current;
    }

    private static applyAllRules(expr: Symbols): Symbols {
        if (!(expr instanceof SymbolicExpression)) {
            return expr;
        }

        // Recursively simplify arguments first
        const simplifiedArgs = expr.args.map(arg => this.applyAllRules(arg));
        const withSimplifiedArgs = new SymbolicExpression(simplifiedArgs, expr.operation);

        // Apply operation-specific simplifications
        return this.simplifyOperation(withSimplifiedArgs);
    }

    private static simplifyOperation(expr: SymbolicExpression): Symbols {
        const { operation, args } = expr;

        switch (operation) {
            case '+':
                return this.simplifyAddition(args);
            case '-':
                return this.simplifySubtraction(args);
            case '*':
                return this.simplifyMultiplication(args);
            case '/':
                return this.simplifyDivision(args);
            case '^':
                return this.simplifyPower(args);
            default:
                return expr;
        }
    }

    private static simplifyAddition(args: Symbols[]): Symbols {
        const [a, b] = args;

        // 0 + x = x
        if (this.isConstant(a, 0)) return b;
        if (this.isConstant(b, 0)) return a;

        // x + x = 2x
        if (a.toString() === b.toString()) {
            return new SymbolicExpression([new Constant(2), a], '*');
        }

        // a + b where both are constants
        if (a instanceof Constant && b instanceof Constant) {
            const result = parseFloat(a.name) + parseFloat(b.name);
            return new Constant(result);
        }

        return new SymbolicExpression(args, '+');
    }

    private static simplifySubtraction(args: Symbols[]): Symbols {
        const [a, b] = args;

        // x - 0 = x
        if (this.isConstant(b, 0)) return a;

        // x - x = 0
        if (a.toString() === b.toString()) {
            return new Constant(0);
        }

        // a - b where both are constants
        if (a instanceof Constant && b instanceof Constant) {
            const result = parseFloat(a.name) - parseFloat(b.name);
            return new Constant(result);
        }

        return new SymbolicExpression(args, '-');
    }

    private static simplifyMultiplication(args: Symbols[]): Symbols {
        const [a, b] = args;

        // 0 * x = 0
        if (this.isConstant(a, 0) || this.isConstant(b, 0)) {
            return new Constant(0);
        }

        // 1 * x = x
        if (this.isConstant(a, 1)) return b;
        if (this.isConstant(b, 1)) return a;

        // x * x = x^2
        if (a.toString() === b.toString()) {
            return new SymbolicExpression([a, new Constant(2)], '^');
        }

        // a * b where both are constants
        if (a instanceof Constant && b instanceof Constant) {
            const result = parseFloat(a.name) * parseFloat(b.name);
            return new Constant(result);
        }

        // Commutativity: move constants to front for canonical form
        if (b instanceof Constant && !(a instanceof Constant)) {
            return new SymbolicExpression([b, a], '*');
        }

        return new SymbolicExpression(args, '*');
    }

    private static simplifyDivision(args: Symbols[]): Symbols {
        const [a, b] = args;

        // x / 1 = x
        if (this.isConstant(b, 1)) return a;

        // x / x = 1
        if (a.toString() === b.toString()) {
            return new Constant(1);
        }

        // 0 / x = 0
        if (this.isConstant(a, 0)) {
            return new Constant(0);
        }

        // a / b where both are constants
        if (a instanceof Constant && b instanceof Constant) {
            const result = parseFloat(a.name) / parseFloat(b.name);
            return new Constant(result);
        }

        return new SymbolicExpression(args, '/');
    }

    private static simplifyPower(args: Symbols[]): Symbols {
        const [base, exp] = args;

        // x^0 = 1
        if (this.isConstant(exp, 0)) {
            return new Constant(1);
        }

        // x^1 = x
        if (this.isConstant(exp, 1)) {
            return base;
        }

        // 0^x = 0
        if (this.isConstant(base, 0)) {
            return new Constant(0);
        }

        // 1^x = 1
        if (this.isConstant(base, 1)) {
            return new Constant(1);
        }

        // a^b where both are constants
        if (base instanceof Constant && exp instanceof Constant) {
            const result = Math.pow(parseFloat(base.name), parseFloat(exp.name));
            return new Constant(result);
        }

        return new SymbolicExpression(args, '^');
    }

    private static isConstant(expr: Symbols, value: number): boolean {
        return expr instanceof Constant && parseFloat(expr.name) === value;
    }
}

/**
 * Equation Solving System
 * Solves linear and quadratic equations
 */
class EquationSolver {
    /**
     * Solve linear equation: ax + b = 0 for x
     */
    static solveLinear(expr: Symbols, variable: Symbols): number | null {
        const coeffs = this.extractLinearCoefficients(expr, variable);
        if (coeffs === null) return null;

        const [a, b] = coeffs;
        if (Math.abs(a) < 1e-10) return null; // No unique solution

        return -b / a;
    }

    /**
     * Solve quadratic equation: ax^2 + bx + c = 0
     */
    static solveQuadratic(expr: Symbols, variable: Symbols): [number, number] | null {
        const coeffs = this.extractQuadraticCoefficients(expr, variable);
        if (coeffs === null) return null;

        const [a, b, c] = coeffs;
        const discriminant = b * b - 4 * a * c;

        if (discriminant < 0) return null; // No real solutions

        const sqrtDisc = Math.sqrt(discriminant);
        const x1 = (-b + sqrtDisc) / (2 * a);
        const x2 = (-b - sqrtDisc) / (2 * a);

        return [x1, x2];
    }

    private static extractLinearCoefficients(
        expr: Symbols,
        variable: Symbols
    ): [number, number] | null {
        let a = 0;
        let b = 0;

        this.extractCoefficientsRecursive(expr, variable, 1, (coeff, power) => {
            if (power === 0) b += coeff;
            else if (power === 1) a += coeff;
        });

        return [a, b];
    }

    private static extractQuadraticCoefficients(
        expr: Symbols,
        variable: Symbols
    ): [number, number, number] | null {
        let a = 0, b = 0, c = 0;

        this.extractCoefficientsRecursive(expr, variable, 1, (coeff, power) => {
            if (power === 0) c += coeff;
            else if (power === 1) b += coeff;
            else if (power === 2) a += coeff;
        });

        return [a, b, c];
    }

    private static extractCoefficientsRecursive(
        expr: Symbols,
        variable: Symbols,
        sign: number,
        callback: (coeff: number, power: number) => void
    ): void {
        if (expr instanceof Constant) {
            callback(sign * parseFloat(expr.name), 0);
            return;
        }

        if (expr === variable || (expr instanceof Symbols && expr.name === variable.name)) {
            callback(sign, 1);
            return;
        }

        if (!(expr instanceof SymbolicExpression)) {
            return;
        }

        if (expr.operation === '+') {
            this.extractCoefficientsRecursive(expr.args[0], variable, sign, callback);
            this.extractCoefficientsRecursive(expr.args[1], variable, sign, callback);
        } else if (expr.operation === '-') {
            this.extractCoefficientsRecursive(expr.args[0], variable, sign, callback);
            this.extractCoefficientsRecursive(expr.args[1], variable, -sign, callback);
        } else if (expr.operation === '*') {
            const [left, right] = expr.args;
            if (left instanceof Constant) {
                this.extractCoefficientsRecursive(right, variable, sign * parseFloat(left.name), callback);
            } else if (right instanceof Constant) {
                this.extractCoefficientsRecursive(left, variable, sign * parseFloat(right.name), callback);
            }
        } else if (expr.operation === '^') {
            const [base, exp] = expr.args;
            if (exp instanceof Constant) {
                const power = parseFloat(exp.name);
                if (base === variable || (base instanceof Symbols && base.name === variable.name)) {
                    callback(sign, power);
                }
            }
        }
    }
}

/**
 * Matrix class for MxN matrix operations and linear algebra
 */
class Matrix {
    private data: number[][];
    private rows: number;
    private cols: number;

    constructor(data: number[][]) {
        if (data.length === 0) {
            throw new Error('Matrix must have at least one row');
        }
        
        const colCount = data[0].length;
        if (data.some(row => row.length !== colCount)) {
            throw new Error('All rows must have the same number of columns');
        }

        this.data = data.map(row => [...row]);
        this.rows = data.length;
        this.cols = colCount;
    }

    /**
     * Get element at position [i, j]
     */
    get(i: number, j: number): number {
        if (i < 0 || i >= this.rows || j < 0 || j >= this.cols) {
            throw new Error(`Index out of bounds: [${i}, ${j}]`);
        }
        return this.data[i][j];
    }

    /**
     * Set element at position [i, j]
     */
    set(i: number, j: number, value: number): void {
        if (i < 0 || i >= this.rows || j < 0 || j >= this.cols) {
            throw new Error(`Index out of bounds: [${i}, ${j}]`);
        }
        this.data[i][j] = value;
    }

    /**
     * Get matrix dimensions [rows, cols]
     */
    shape(): [number, number] {
        return [this.rows, this.cols];
    }

    /**
     * Matrix addition (both matrices must have same dimensions)
     */
    add(other: Matrix): Matrix {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error(
                `Cannot add ${this.rows}x${this.cols} matrix to ${other.rows}x${other.cols} matrix`
            );
        }

        const result = this.data.map((row, i) =>
            row.map((val, j) => val + other.get(i, j))
        );

        return new Matrix(result);
    }

    /**
     * Matrix subtraction (both matrices must have same dimensions)
     */
    subtract(other: Matrix): Matrix {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error(
                `Cannot subtract ${other.rows}x${other.cols} matrix from ${this.rows}x${this.cols} matrix`
            );
        }

        const result = this.data.map((row, i) =>
            row.map((val, j) => val - other.get(i, j))
        );

        return new Matrix(result);
    }

    /**
     * Scalar multiplication
     */
    scalarMultiply(scalar: number): Matrix {
        const result = this.data.map(row => row.map(val => val * scalar));
        return new Matrix(result);
    }

    /**
     * Matrix multiplication: (MxN) * (NxP) = (MxP)
     */
    multiply(other: Matrix): Matrix {
        if (this.cols !== other.rows) {
            throw new Error(
                `Cannot multiply ${this.rows}x${this.cols} matrix by ${other.rows}x${other.cols} matrix`
            );
        }

        const result: number[][] = [];

        for (let i = 0; i < this.rows; i++) {
            result[i] = [];
            for (let j = 0; j < other.cols; j++) {
                let sum = 0;
                for (let k = 0; k < this.cols; k++) {
                    sum += this.get(i, k) * other.get(k, j);
                }
                result[i][j] = sum;
            }
        }

        return new Matrix(result);
    }

    /**
     * Matrix-vector multiplication: (MxN) * (Nx1) = (Mx1)
     */
    multiplyVector(v: number[]): number[] {
        if (v.length !== this.cols) {
            throw new Error(
                `Cannot multiply ${this.rows}x${this.cols} matrix by vector of length ${v.length}`
            );
        }

        const result: number[] = [];

        for (let i = 0; i < this.rows; i++) {
            let sum = 0;
            for (let j = 0; j < this.cols; j++) {
                sum += this.get(i, j) * v[j];
            }
            result[i] = sum;
        }

        return result;
    }

    /**
     * Matrix transpose: (MxN)^T = (NxM)
     */
    transpose(): Matrix {
        const result: number[][] = [];

        for (let j = 0; j < this.cols; j++) {
            result[j] = [];
            for (let i = 0; i < this.rows; i++) {
                result[j][i] = this.get(i, j);
            }
        }

        return new Matrix(result);
    }

    /**
     * Calculate determinant (only for square matrices)
     */
    determinant(): number {
        if (this.rows !== this.cols) {
            throw new Error(`Determinant requires square matrix, got ${this.rows}x${this.cols}`);
        }

        const n = this.rows;

        if (n === 1) {
            return this.get(0, 0);
        }

        if (n === 2) {
            return this.get(0, 0) * this.get(1, 1) - this.get(0, 1) * this.get(1, 0);
        }

        // LU decomposition for efficiency
        let det = 1;
        const copy = new Matrix(this.data);

        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(copy.get(k, i)) > Math.abs(copy.get(maxRow, i))) {
                    maxRow = k;
                }
            }

            if (Math.abs(copy.get(maxRow, i)) < 1e-10) {
                return 0;
            }

            // Swap rows
            if (maxRow !== i) {
                [copy.data[i], copy.data[maxRow]] = [copy.data[maxRow], copy.data[i]];
                det *= -1;
            }

            det *= copy.get(i, i);

            // Eliminate column
            for (let k = i + 1; k < n; k++) {
                const factor = copy.get(k, i) / copy.get(i, i);
                for (let j = i; j < n; j++) {
                    copy.set(k, j, copy.get(k, j) - factor * copy.get(i, j));
                }
            }
        }

        return det;
    }

    /**
     * Matrix inverse (for square matrices)
     */
    inverse(): Matrix {
        if (this.rows !== this.cols) {
            throw new Error(`Inverse requires square matrix, got ${this.rows}x${this.cols}`);
        }

        const det = this.determinant();

        if (Math.abs(det) < 1e-10) {
            throw new Error('Matrix is singular (determinant is zero)');
        }

        if (this.rows === 2) {
            const a = this.get(0, 0);
            const b = this.get(0, 1);
            const c = this.get(1, 0);
            const d = this.get(1, 1);

            return new Matrix([
                [d / det, -b / det],
                [-c / det, a / det]
            ]);
        }

        // Gauss-Jordan elimination
        const augmented: number[][] = [];
        for (let i = 0; i < this.rows; i++) {
            augmented[i] = [...this.data[i]];
            for (let j = 0; j < this.cols; j++) {
                augmented[i].push(i === j ? 1 : 0);
            }
        }

        const n = this.rows;

        // Forward elimination
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }

            if (Math.abs(augmented[maxRow][i]) < 1e-10) {
                throw new Error('Matrix is singular');
            }

            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

            // Scale pivot row
            const pivot = augmented[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= pivot;
            }

            // Eliminate column
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = augmented[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                }
            }
        }

        // Extract inverse from augmented matrix
        const inverse: number[][] = [];
        for (let i = 0; i < n; i++) {
            inverse[i] = augmented[i].slice(n);
        }

        return new Matrix(inverse);
    }

    /**
     * Gaussian elimination for solving Ax = b
     */
    gaussianElimination(): number[] | null {
        if (this.cols !== this.rows + 1) {
            throw new Error('Augmented matrix must have n+1 columns for n rows');
        }

        const n = this.rows;
        const augmented = this.data.map(row => [...row]);

        // Forward elimination with partial pivoting
        for (let i = 0; i < n; i++) {
            // Find pivot
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }

            // Swap rows
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

            // Check for singular matrix
            if (Math.abs(augmented[i][i]) < 1e-10) {
                return null;
            }

            // Eliminate column
            for (let k = i + 1; k < n; k++) {
                const factor = augmented[k][i] / augmented[i][i];
                for (let j = i; j < augmented[i].length; j++) {
                    augmented[k][j] -= factor * augmented[i][j];
                }
            }
        }

        // Back substitution
        const solution: number[] = new Array(n);

        for (let i = n - 1; i >= 0; i--) {
            solution[i] = augmented[i][n];
            for (let j = i + 1; j < n; j++) {
                solution[i] -= augmented[i][j] * solution[j];
            }
            solution[i] /= augmented[i][i];
        }

        return solution;
    }

    /**
     * Get matrix as 2D array
     */
    toArray(): number[][] {
        return this.data.map(row => [...row]);
    }

    /**
     * Pretty print matrix
     */
    toString(): string {
        return this.data
            .map(row =>
                '[ ' + row.map(x => x.toFixed(4)).join('  ') + ' ]'
            )
            .join('\n');
    }
}

export { Simplifier, EquationSolver, Matrix };