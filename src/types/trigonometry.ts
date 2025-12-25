//src/types/trigonometry.ts

import { Symbols, Constant, SymbolicExpression } from './symbols';

/**
 * Base class for trigonometric functions
 */
abstract class TrigonometricFunction extends SymbolicExpression {
    constructor(arg: Symbols, functionName: string) {
        super([arg], functionName);
    }

    get argument(): Symbols {
        return this.args[0];
    }

    toString(): string {
        return `${this.operation}(${this.argument})`;
    }

    /** Differentiate with respect to a variable */
    diff(variable: Symbols): Symbols {
        return this.differentiate(variable);
    }

    /** Abstract method for differentiation - to be implemented by subclasses */
    abstract differentiate(variable: Symbols): Symbols;
}

/**
 * Sine function
 */
class Sin extends TrigonometricFunction {
    constructor(arg: Symbols) {
        super(arg, 'sin');
    }

    differentiate(variable: Symbols): Symbols {
        const dArg = this.argument.diff(variable);
        return new SymbolicExpression([new Cos(this.argument), dArg], '*');
    }
}

/**
 * Cosine function
 */
class Cos extends TrigonometricFunction {
    constructor(arg: Symbols) {
        super(arg, 'cos');
    }

    differentiate(variable: Symbols): Symbols {
        const dArg = this.argument.diff(variable);
        return new SymbolicExpression([new Constant(-1), new SymbolicExpression([new Sin(this.argument), dArg], '*')], '*');
    }
}

/**
 * Tangent function
 */
class Tan extends TrigonometricFunction {
    constructor(arg: Symbols) {
        super(arg, 'tan');
    }

    differentiate(variable: Symbols): Symbols {
        const dArg = this.argument.diff(variable);
        return new SymbolicExpression([new SymbolicExpression([new Constant(1), new SymbolicExpression([new Cos(this.argument), new Constant(2)], '^')], '/'), dArg], '*');
    }
}

/**
 * Cotangent function
 */
class Cot extends TrigonometricFunction {
    constructor(arg: Symbols) {
        super(arg, 'cot');
    }

    differentiate(variable: Symbols): Symbols {
        const dArg = this.argument.diff(variable);
        return new SymbolicExpression([new Constant(-1), new SymbolicExpression([new SymbolicExpression([new Constant(1), new SymbolicExpression([new Sin(this.argument), new Constant(2)], '^')], '/'), dArg], '*')], '*');
    }
}

/**
 * Secant function
 */
class Sec extends TrigonometricFunction {
    constructor(arg: Symbols) {
        super(arg, 'sec');
    }

    differentiate(variable: Symbols): Symbols {
        const dArg = this.argument.diff(variable);
        return new SymbolicExpression([new SymbolicExpression([new Sec(this.argument), new Tan(this.argument)], '*'), dArg], '*');
    }
}

/**
 * Cosecant function
 */
class Csc extends TrigonometricFunction {
    constructor(arg: Symbols) {
        super(arg, 'csc');
    }

    differentiate(variable: Symbols): Symbols {
        const dArg = this.argument.diff(variable);
        return new SymbolicExpression([new Constant(-1), new SymbolicExpression([new SymbolicExpression([new Csc(this.argument), new Cot(this.argument)], '*'), dArg], '*')], '*');
    }
}

/**
 * Arcsine function
 */
class Asin extends TrigonometricFunction {
    constructor(arg: Symbols) {
        super(arg, 'asin');
    }

    differentiate(variable: Symbols): Symbols {
        const dArg = this.argument.diff(variable);
        return new SymbolicExpression([dArg, new SymbolicExpression([new Constant(1), new SymbolicExpression([new Constant(1), new SymbolicExpression([this.argument, new Constant(2)], '^')], '-')], '^')], '/');
    }
}

/**
 * Arccosine function
 */
class Acos extends TrigonometricFunction {
    constructor(arg: Symbols) {
        super(arg, 'acos');
    }

    differentiate(variable: Symbols): Symbols {
        const dArg = this.argument.diff(variable);
        return new SymbolicExpression([new Constant(-1), new SymbolicExpression([dArg, new SymbolicExpression([new Constant(1), new SymbolicExpression([new Constant(1), new SymbolicExpression([this.argument, new Constant(2)], '^')], '-')], '^')], '/')], '*');
    }
}

/**
 * Arctangent function
 */
class Atan extends TrigonometricFunction {
    constructor(arg: Symbols) {
        super(arg, 'atan');
    }

    differentiate(variable: Symbols): Symbols {
        const dArg = this.argument.diff(variable);
        return new SymbolicExpression([dArg, new SymbolicExpression([new Constant(1), new SymbolicExpression([new Constant(1), new SymbolicExpression([this.argument, new Constant(2)], '^')], '+')], '/')], '/');
    }
}

/**
 * Common angle values in radians
 */
const COMMON_ANGLES = {
    '0': 0,
    'π/6': Math.PI / 6,     // 30°
    'π/4': Math.PI / 4,     // 45°
    'π/3': Math.PI / 3,     // 60°
    'π/2': Math.PI / 2,     // 90°
    'π': Math.PI,           // 180°
    '3π/2': 3 * Math.PI / 2, // 270°
    '2π': 2 * Math.PI       // 360°
};

/**
 * Exact values for common trigonometric angles
 */
const EXACT_VALUES: Record<string, Record<string, number>> = {
    '0': { sin: 0, cos: 1, tan: 0, cot: Infinity, sec: 1, csc: Infinity },
    'π/6': { sin: 1/2, cos: Math.sqrt(3)/2, tan: 1/Math.sqrt(3), cot: Math.sqrt(3), sec: 2/Math.sqrt(3), csc: 2 },
    'π/4': { sin: Math.sqrt(2)/2, cos: Math.sqrt(2)/2, tan: 1, cot: 1, sec: Math.sqrt(2), csc: Math.sqrt(2) },
    'π/3': { sin: Math.sqrt(3)/2, cos: 1/2, tan: Math.sqrt(3), cot: 1/Math.sqrt(3), sec: 2, csc: 2/Math.sqrt(3) },
    'π/2': { sin: 1, cos: 0, tan: Infinity, cot: 0, sec: Infinity, csc: 1 },
    'π': { sin: 0, cos: -1, tan: 0, cot: Infinity, sec: -1, csc: Infinity },
    '3π/2': { sin: -1, cos: 0, tan: Infinity, cot: 0, sec: Infinity, csc: -1 },
    '2π': { sin: 0, cos: 1, tan: 0, cot: Infinity, sec: 1, csc: Infinity }
};

/**
 * Check if an angle matches a common angle
 */
function isCommonAngle(angle: Symbols): string | null {
    if (angle instanceof Constant) {
        const value = angle.getValue();
        
        // Check direct matches
        for (const [angleStr, angleValue] of Object.entries(COMMON_ANGLES)) {
            if (Math.abs(value - angleValue) < 1e-10) {
                return angleStr;
            }
        }
        
        // Check for multiples of π
        for (const [angleStr, angleValue] of Object.entries(COMMON_ANGLES)) {
            if (angleStr !== '0' && Math.abs(value / angleValue - Math.round(value / angleValue)) < 1e-10) {
                const multiple = Math.round(value / angleValue);
                if (multiple === 1) return angleStr;
                if (multiple === -1) return `-${angleStr}`;
            }
        }
    }
    
    // Check for symbolic representations like π/6, π/4, etc.
    if (angle instanceof SymbolicExpression && angle.operation === '/') {
        const [numerator, denominator] = angle.args;
        if (numerator instanceof SymbolicExpression && numerator.operation === 'pi') {
            if (denominator instanceof Constant) {
                const denom = denominator.getValue();
                if ([2, 3, 4, 6].includes(denom)) {
                    return `π/${denom}`;
                }
            }
        }
    }
    
    return null;
}

/**
 * Get exact value for a trigonometric function at a common angle
 */
function getExactValue(func: string, angleStr: string): number | null {
    const values = EXACT_VALUES[angleStr];
    if (!values) return null;
    
    const value = values[func];
    return (value === Infinity || value === -Infinity) ? value : value;
}

/**
 * Simplify trigonometric expressions
 */
function simplifyTrig(expr: Symbols): Symbols {
    if (expr instanceof Sin) {
        const commonAngle = isCommonAngle(expr.argument);
        if (commonAngle) {
            const exactValue = getExactValue('sin', commonAngle);
            if (exactValue !== null && exactValue !== Infinity && exactValue !== -Infinity) {
                return new Constant(exactValue);
            }
        }
        
        // Apply trigonometric identities
        return simplifySin(expr.argument);
    }
    
    if (expr instanceof Cos) {
        const commonAngle = isCommonAngle(expr.argument);
        if (commonAngle) {
            const exactValue = getExactValue('cos', commonAngle);
            if (exactValue !== null && exactValue !== Infinity && exactValue !== -Infinity) {
                return new Constant(exactValue);
            }
        }
        
        return simplifyCos(expr.argument);
    }
    
    if (expr instanceof Tan) {
        const commonAngle = isCommonAngle(expr.argument);
        if (commonAngle) {
            const exactValue = getExactValue('tan', commonAngle);
            if (exactValue !== null && exactValue !== Infinity && exactValue !== -Infinity) {
                return new Constant(exactValue);
            }
        }
        
        // tan(x) = sin(x)/cos(x)
        return new SymbolicExpression([
            new Sin(expr.argument),
            new Cos(expr.argument)
        ], '/');
    }
    
    if (expr instanceof Cot) {
        const commonAngle = isCommonAngle(expr.argument);
        if (commonAngle) {
            const exactValue = getExactValue('cot', commonAngle);
            if (exactValue !== null && exactValue !== Infinity && exactValue !== -Infinity) {
                return new Constant(exactValue);
            }
        }
        
        // cot(x) = cos(x)/sin(x)
        return new SymbolicExpression([
            new Cos(expr.argument),
            new Sin(expr.argument)
        ], '/');
    }
    
    if (expr instanceof Sec) {
        const commonAngle = isCommonAngle(expr.argument);
        if (commonAngle) {
            const exactValue = getExactValue('sec', commonAngle);
            if (exactValue !== null && exactValue !== Infinity && exactValue !== -Infinity) {
                return new Constant(exactValue);
            }
        }
        
        // sec(x) = 1/cos(x)
        return new SymbolicExpression([
            new Constant(1),
            new Cos(expr.argument)
        ], '/');
    }
    
    if (expr instanceof Csc) {
        const commonAngle = isCommonAngle(expr.argument);
        if (commonAngle) {
            const exactValue = getExactValue('csc', commonAngle);
            if (exactValue !== null && exactValue !== Infinity && exactValue !== -Infinity) {
                return new Constant(exactValue);
            }
        }
        
        // csc(x) = 1/sin(x)
        return new SymbolicExpression([
            new Constant(1),
            new Sin(expr.argument)
        ], '/');
    }
    
    return expr;
}

/**
 * Simplify sine expressions using identities
 */
function simplifySin(arg: Symbols): Symbols {
    // sin(-x) = -sin(x)
    if (arg instanceof SymbolicExpression && arg.operation === '-') {
        return new SymbolicExpression([new Constant(-1), new Sin(arg.args[0])], '*');
    }
    
    // sin(π - x) = sin(x)
    if (arg instanceof SymbolicExpression && arg.operation === '-') {
        const [left, right] = arg.args;
        if (isPi(left)) {
            return new Sin(right);
        }
    }
    
    // sin(π + x) = -sin(x)
    if (arg instanceof SymbolicExpression && arg.operation === '+') {
        const [left, right] = arg.args;
        if (isPi(left)) {
            return new SymbolicExpression([new Constant(-1), new Sin(right)], '*');
        }
    }
    
    return new Sin(arg);
}

/**
 * Simplify cosine expressions using identities
 */
function simplifyCos(arg: Symbols): Symbols {
    // cos(-x) = cos(x)
    if (arg instanceof SymbolicExpression && arg.operation === '-') {
        return new Cos(arg.args[0]);
    }
    
    // cos(π - x) = -cos(x)
    if (arg instanceof SymbolicExpression && arg.operation === '-') {
        const [left, right] = arg.args;
        if (isPi(left)) {
            return new SymbolicExpression([new Constant(-1), new Cos(right)], '*');
        }
    }
    
    // cos(π + x) = -cos(x)
    if (arg instanceof SymbolicExpression && arg.operation === '+') {
        const [left, right] = arg.args;
        if (isPi(left)) {
            return new SymbolicExpression([new Constant(-1), new Cos(right)], '*');
        }
    }
    
    return new Cos(arg);
}

/**
 * Check if an expression represents π
 */
function isPi(expr: Symbols): boolean {
    return expr instanceof SymbolicExpression && expr.operation === 'pi';
}

/**
 * Create trigonometric functions
 */
function sin(arg: Symbols | number): Sin {
    const symbolArg = arg instanceof Symbols ? arg : new Constant(arg);
    return new Sin(symbolArg);
}

function cos(arg: Symbols | number): Cos {
    const symbolArg = arg instanceof Symbols ? arg : new Constant(arg);
    return new Cos(symbolArg);
}

function tan(arg: Symbols | number): Tan {
    const symbolArg = arg instanceof Symbols ? arg : new Constant(arg);
    return new Tan(symbolArg);
}

function cot(arg: Symbols | number): Cot {
    const symbolArg = arg instanceof Symbols ? arg : new Constant(arg);
    return new Cot(symbolArg);
}

function sec(arg: Symbols | number): Sec {
    const symbolArg = arg instanceof Symbols ? arg : new Constant(arg);
    return new Sec(symbolArg);
}

function csc(arg: Symbols | number): Csc {
    const symbolArg = arg instanceof Symbols ? arg : new Constant(arg);
    return new Csc(symbolArg);
}

function asin(arg: Symbols | number): Asin {
    const symbolArg = arg instanceof Symbols ? arg : new Constant(arg);
    return new Asin(symbolArg);
}

function acos(arg: Symbols | number): Acos {
    const symbolArg = arg instanceof Symbols ? arg : new Constant(arg);
    return new Acos(symbolArg);
}

function atan(arg: Symbols | number): Atan {
    const symbolArg = arg instanceof Symbols ? arg : new Constant(arg);
    return new Atan(symbolArg);
}

/**
 * Create a symbolic π constant
 */
function pi(): SymbolicExpression {
    return new SymbolicExpression([], 'pi');
}

export {
    Sin, Cos, Tan, Cot, Sec, Csc, Asin, Acos, Atan,
    sin, cos, tan, cot, sec, csc, asin, acos, atan,
    simplifyTrig, COMMON_ANGLES, EXACT_VALUES, pi
};