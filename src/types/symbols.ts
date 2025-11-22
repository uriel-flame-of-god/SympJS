//src/types/symbols.ts

/**
 * Represents a symbolic variable for mathematical expressions
 * Inspired by SymPy's symbolic computation capabilities
 */
class Symbols {
    readonly name: string;
    
    constructor(name: string) {
        this.name = name;
        return new Proxy(this, {
            get: (target, prop, receiver) => {
                // Handle arithmetic operators
                if (prop === Symbol.for('+')) return (other: any) => target.add(other);
                if (prop === Symbol.for('-')) return (other: any) => target.sub(other);
                if (prop === Symbol.for('*')) return (other: any) => target.mul(other);
                if (prop === Symbol.for('/')) return (other: any) => target.div(other);
                if (prop === Symbol.for('**')) return (other: any) => target.pow(other);
                
                return Reflect.get(target, prop, receiver);
            }
        });
    }

    /** Create a symbolic expression representing addition */
    add(other: Symbols | number): Symbols {
        const otherSym = this.toSymbol(other);
        return new SymbolicExpression([this, otherSym], '+');
    }

    /** Create a symbolic expression representing subtraction */
    sub(other: Symbols | number): Symbols {
        const otherSym = this.toSymbol(other);
        return new SymbolicExpression([this, otherSym], '-');
    }

    /** Create a symbolic expression representing multiplication */
    mul(other: Symbols | number): Symbols {
        const otherSym = this.toSymbol(other);
        return new SymbolicExpression([this, otherSym], '*');
    }

    /** Create a symbolic expression representing division */
    div(other: Symbols | number): Symbols {
        const otherSym = this.toSymbol(other);
        return new SymbolicExpression([this, otherSym], '/');
    }

    /** Create a symbolic expression representing exponentiation */
    pow(other: Symbols | number): Symbols {
        const otherSym = this.toSymbol(other);
        return new SymbolicExpression([this, otherSym], '^');
    }

    /** Differentiate with respect to a variable */
    diff(variable: Symbols): Symbols {
        return differentiate(this, variable);
    }

    /** Convert number to constant symbol */
    private toSymbol(value: Symbols | number): Symbols {
        if (value instanceof Symbols) return value;
        return new Constant(value);
    }

    /** String representation */
    toString(): string {
        return this.name;
    }

    /** Prevent accidental numeric conversion */
    valueOf(): number {
        throw new Error(`Cannot convert symbolic variable '${this.name}' to number. Use numeric evaluation instead.`);
    }
}

/**
 * Represents a numeric constant
 */
class Constant extends Symbols {
    constructor(value: number) {
        super(value.toString());
    }
}

/**
 * Represents a compound symbolic expression
 */
class SymbolicExpression extends Symbols {
    constructor(
        readonly args: Symbols[], 
        readonly operation: string
    ) {
        super('');
    }

    toString(): string {
        switch (this.operation) {
            case '+':
                return `(${this.args[0]} + ${this.args[1]})`;
            case '-':
                return `(${this.args[0]} - ${this.args[1]})`;
            case '*':
                return `(${this.args[0]} * ${this.args[1]})`;
            case '/':
                return `(${this.args[0]} / ${this.args[1]})`;
            case '^':
                return `(${this.args[0]}^${this.args[1]})`;
            default:
                return `${this.operation}(${this.args.join(', ')})`;
        }
    }
}

/**
 * Differentiate a symbolic expression with respect to a variable
 */
/**
 * Differentiate a symbolic expression with respect to a variable
 */
function differentiate(expr: Symbols, variable: Symbols): Symbols {
    // If the expression is exactly the same variable instance
    if (expr === variable) {
        return new Constant(1);
    }
    
    // If it's a basic symbol (variable) with the same name
    if (expr instanceof Symbols && !(expr instanceof SymbolicExpression) && !(expr instanceof Constant)) {
        if (expr.name === variable.name) {
            return new Constant(1);
        } else {
            return new Constant(0);
        }
    }
    
    // If the expression is a constant, derivative is 0
    if (expr instanceof Constant) {
        return new Constant(0);
    }
    
    // Handle symbolic expressions
    if (expr instanceof SymbolicExpression) {
        switch (expr.operation) {
            case '+':
            case '-':
                // Sum/difference rule: d(u ± v)/dx = du/dx ± dv/dx
                const differentiatedArgs = expr.args.map(arg => differentiate(arg, variable));
                return new SymbolicExpression(differentiatedArgs, expr.operation);
                
            case '*':
                // Product rule: d(u*v)/dx = u*dv/dx + v*du/dx
                const [u, v] = expr.args;
                const du = differentiate(u, variable);
                const dv = differentiate(v, variable);
                return new SymbolicExpression([
                    new SymbolicExpression([u, dv], '*'),
                    new SymbolicExpression([v, du], '*')
                ], '+');
                
            case '/':
                // Quotient rule: d(u/v)/dx = (v*du/dx - u*dv/dx) / v^2
                const [numerator, denominator] = expr.args;
                const dNum = differentiate(numerator, variable);
                const dDen = differentiate(denominator, variable);
                return new SymbolicExpression([
                    new SymbolicExpression([
                        new SymbolicExpression([denominator, dNum], '*'),
                        new SymbolicExpression([numerator, dDen], '*')
                    ], '-'),
                    new SymbolicExpression([denominator, new Constant(2)], '^')
                ], '/');
                
            case '^':
                const [base, exponent] = expr.args;
                
                // If exponent is constant: power rule d(x^n)/dx = n*x^(n-1)
                if (exponent instanceof Constant) {
                    const n = parseFloat(exponent.name);
                    return new SymbolicExpression([
                        new Constant(n),
                        new SymbolicExpression([
                            base,
                            new Constant(n - 1)
                        ], '^')
                    ], '*');
                }
                
                // If base is constant: d(a^u)/dx = a^u * ln(a) * du/dx
                if (base instanceof Constant) {
                    const a = parseFloat(base.name);
                    return new SymbolicExpression([
                        expr,
                        new SymbolicExpression([
                            new Constant(Math.log(a)),
                            differentiate(exponent, variable)
                        ], '*')
                    ], '*');
                }
                
                throw new Error('General exponent differentiation not yet implemented');
                
            default:
                throw new Error(`Unknown operation: ${expr.operation}`);
        }
    }
    
    throw new Error(`Cannot differentiate expression: ${expr}`);
}
/**
 * Create symbolic variables
 * @param names Variable names
 * @returns Array of Symbols instances
 */
function symbols(...names: string[]): Symbols[] {
    return names.map(name => new Symbols(name));
}

// Alias for backward compatibility
const diff = differentiate;

export { symbols, Symbols, differentiate, diff, Constant, SymbolicExpression };