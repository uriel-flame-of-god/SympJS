/**
    Taylor Series Expansion

    Computes Taylor series approximations of symbolic functions
    */

import { Symbols, Constant, SymbolicExpression, differentiate } from '../types/symbols';
import { Simplifier } from './algebra';
import { Complex } from '../types/complex';

class TaylorSeries {
    /**
    * Compute Taylor series expansion of a function around a point
    * @param func The function to expand (as a symbolic expression)
    * @param variable The variable to expand with respect to
    * @param point The point to expand around (can be number or Complex)
    * @param order The order of the expansion (number of terms)
    * @returns Array of coefficients [a0, a1, a2, ...] where a_n = f^(n)(a)/n!
    */
    static expand(
        func: Symbols,
        variable: Symbols,
        point: number | Complex = 0,
        order: number = 5
    ): Symbols[] {
        const coefficients: Symbols[] = [];
        let currentFunc = func;
        
        for (let n = 0; n <= order; n++) {
            // Compute nth derivative
            const nthDerivative = this.nthDerivative(currentFunc, variable, n);
            
            // Evaluate derivative at expansion point
            const derivativeAtPoint = this.evaluateAt(nthDerivative, variable, point);
            
            // Compute coefficient: f^(n)(a) / n!
            const coefficient = this.divideByFactorial(derivativeAtPoint, n);
            
            coefficients.push(coefficient);
        }
        
        return coefficients;
    }

    /**
     * Compute the nth derivative of a function
     */
    private static nthDerivative(
        func: Symbols, 
        variable: Symbols, 
        n: number
    ): Symbols {
        if (n === 0) return func;
        
        let result = func;
        for (let i = 0; i < n; i++) {
            result = differentiate(result, variable);
            // Simplify after each derivative to avoid explosion
            result = Simplifier.simplify(result);
        }
        return result;
    }

    /**
     * Evaluate a symbolic expression at a specific point
     */
    private static evaluateAt(
        expr: Symbols,
        variable: Symbols,
        point: number | Complex
    ): Symbols {
        // Base case: if expression is the variable
        if (expr === variable || (expr instanceof Symbols && expr.name === variable.name && !(expr instanceof Constant))) {
            if (typeof point === 'number') {
                return new Constant(point);
            } else {
                return new Constant(point.real as number);
            }
        }
        
        // If it's a constant, return it
        if (expr instanceof Constant) {
            return expr;
        }
        
        // If it's a symbolic expression, recursively evaluate
        if (expr instanceof SymbolicExpression) {
            const evaluatedArgs = expr.args.map(arg => 
                this.evaluateAt(arg, variable, point)
            );
            
            // Create new expression with evaluated args and simplify
            const evaluated = new SymbolicExpression(evaluatedArgs, expr.operation);
            return this.simplifyNumericExpression(evaluated);
        }
        
        return expr;
    }

    /**
     * Simplify expressions with numeric constants
     */
    private static simplifyNumericExpression(expr: Symbols): Symbols {
        if (!(expr instanceof SymbolicExpression)) {
            return expr;
        }
        
        const args = expr.args;
        
        // If all arguments are constants, compute the numeric value
        if (args.every(arg => arg instanceof Constant)) {
            const numericArgs = args.map(arg => parseFloat((arg as Constant).name));
            
            switch (expr.operation) {
                case '+':
                    return new Constant(numericArgs[0] + numericArgs[1]);
                case '-':
                    return new Constant(numericArgs[0] - numericArgs[1]);
                case '*':
                    return new Constant(numericArgs[0] * numericArgs[1]);
                case '/':
                    if (Math.abs(numericArgs[1]) < 1e-10) {
                        return expr; // Avoid division by zero
                    }
                    return new Constant(numericArgs[0] / numericArgs[1]);
                case '^':
                    return new Constant(Math.pow(numericArgs[0], numericArgs[1]));
                default:
                    return expr;
            }
        }
        
        return expr;
    }

    /**
     * Divide expression by n factorial
     */
    private static divideByFactorial(expr: Symbols, n: number): Symbols {
        if (n === 0) return expr; // 0! = 1
        
        const factorial = this.factorial(n);
        if (expr instanceof Constant) {
            const val = parseFloat(expr.name) / factorial;
            return new Constant(val);
        }
        
        return new SymbolicExpression([expr, new Constant(factorial)], '/');
    }

    /**
     * Compute factorial
     */
    private static factorial(n: number): number {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    /**
     * Generate the Taylor series polynomial as a symbolic expression
     * @param coefficients Taylor series coefficients [a0, a1, a2, ...]
     * @param variable The expansion variable
     * @param point The expansion point
     * @returns Symbolic expression representing the Taylor polynomial
     */
    static toPolynomial(
        coefficients: Symbols[],
        variable: Symbols,
        point: number | Complex = 0
    ): Symbols {
        if (coefficients.length === 0) {
            return new Constant(0);
        }
        
        // Start with the first coefficient
        let polynomial = coefficients[0];
        const pointVal = typeof point === 'number' ? point : (point.real as number);
        
        for (let n = 1; n < coefficients.length; n++) {
            // Skip zero coefficients to keep expressions cleaner
            if (this.isZero(coefficients[n])) {
                continue;
            }
            
            // Term: a_n * (x - a)^n
            const xMinusA = pointVal === 0 
                ? variable 
                : new SymbolicExpression([variable, new Constant(pointVal)], '-');
            
            const powerTerm = n === 1 
                ? xMinusA 
                : new SymbolicExpression([xMinusA, new Constant(n)], '^');
            
            const term = new SymbolicExpression([coefficients[n], powerTerm], '*');
            polynomial = new SymbolicExpression([polynomial, term], '+');
        }
        
        return Simplifier.simplify(polynomial);
    }

    /**
     * Check if a symbolic expression is effectively zero
     */
    private static isZero(expr: Symbols): boolean {
        if (expr instanceof Constant) {
            return Math.abs(parseFloat(expr.name)) < 1e-10;
        }
        return false;
    }

    /**
     * Compute radius of convergence using ratio test
     */
    static radiusOfConvergence(coefficients: Symbols[]): number {
        if (coefficients.length < 2) {
            return Infinity;
        }
        
        // Simple ratio test for numeric coefficients
        const numericCoeffs = coefficients.map(coeff => {
            if (coeff instanceof Constant) {
                return Math.abs(parseFloat(coeff.name));
            }
            return 1; // For symbolic coefficients, assume 1 for simplicity
        });
        
        let maxRatio = 0;
        
        for (let n = 1; n < numericCoeffs.length - 1; n++) {
            if (numericCoeffs[n] === 0) continue;
            
            const ratio = numericCoeffs[n] / numericCoeffs[n + 1];
            maxRatio = Math.max(maxRatio, Math.abs(ratio));
        }
        
        return maxRatio || Infinity;
    }

    /**
     * Specialized Taylor series for common functions
     */

    /**
     * Taylor series for exponential function e^x
     */
    static expSeries(_variable: Symbols, order: number = 5): Symbols[] {
        const coefficients: Symbols[] = [];
        
        for (let n = 0; n <= order; n++) {
            coefficients.push(new Constant(1 / this.factorial(n)));
        }
        
        return coefficients;
    }

    /**
     * Taylor series for sine function sin(x)
     */
    static sinSeries(_variable: Symbols, order: number = 5): Symbols[] {
        const coefficients: Symbols[] = [];
        
        for (let n = 0; n <= order; n++) {
            if (n % 2 === 0) {
                // Even terms are zero for sine
                coefficients.push(new Constant(0));
            } else {
                const sign = (n % 4 === 1) ? 1 : -1;
                coefficients.push(new Constant(sign / this.factorial(n)));
            }
        }
        
        return coefficients;
    }

    /**
     * Taylor series for cosine function cos(x)
     */
    static cosSeries(_variable: Symbols, order: number = 5): Symbols[] {
        const coefficients: Symbols[] = [];
        
        for (let n = 0; n <= order; n++) {
            if (n % 2 === 1) {
                // Odd terms are zero for cosine
                coefficients.push(new Constant(0));
            } else {
                const sign = (n % 4 === 0) ? 1 : -1;
                coefficients.push(new Constant(sign / this.factorial(n)));
            }
        }
        
        return coefficients;
    }

    /**
     * Taylor series for natural logarithm ln(1 + x)
     */
    static lnSeries(_variable: Symbols, order: number = 5): Symbols[] {
        const coefficients: Symbols[] = [];
        
        for (let n = 0; n <= order; n++) {
            if (n === 0) {
                coefficients.push(new Constant(0));
            } else {
                const sign = (n % 2 === 0) ? -1 : 1;
                coefficients.push(new Constant(sign / n));
            }
        }
        
        return coefficients;
    }

    /**
     * Estimate error term for Taylor series approximation
     */
    static errorBound(
        _func: Symbols,
        _variable: Symbols,
        point: number,
        evaluationPoint: number,
        order: number
    ): number {
        const maxDerivative = 1; // Placeholder
        const distance = Math.abs(evaluationPoint - point);
        
        return (maxDerivative * Math.pow(distance, order + 1)) / this.factorial(order + 1);
    }
}

export { TaylorSeries };