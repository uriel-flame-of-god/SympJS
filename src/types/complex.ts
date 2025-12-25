/**

    Complex Number System

    Supports symbolic and numeric complex arithmetic
    
**/

class Complex {
readonly real: number | any; // Can be numeric or symbolic
readonly imag: number | any; // Can be numeric or symbolic

constructor(real: number | any = 0, imag: number | any = 0) {
    this.real = real;
    this.imag = imag;
}

/**
 * Create complex number from real and imaginary parts
 */
static fromRectangular(real: number, imag: number): Complex {
    return new Complex(real, imag);
}

/**
 * Create complex number from polar coordinates
 */
static fromPolar(magnitude: number, angle: number): Complex {
    return new Complex(
        magnitude * Math.cos(angle),
        magnitude * Math.sin(angle)
    );
}

/**
 * Get the magnitude (absolute value) of the complex number
 */
magnitude(): number {
    if (typeof this.real === 'number' && typeof this.imag === 'number') {
        return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }
    // For symbolic parts, return symbolic expression
    return Math.sqrt(this.real * this.real + this.imag * this.imag) as any;
}

/**
 * Get the phase angle (argument) in radians
 */
phase(): number {
    if (typeof this.real === 'number' && typeof this.imag === 'number') {
        return Math.atan2(this.imag, this.real);
    }
    return Math.atan2(this.imag, this.real) as any;
}

/**
 * Complex conjugate
 */
conjugate(): Complex {
    return new Complex(this.real, -this.imag);
}

/**
 * Complex addition
 */
add(other: Complex | number): Complex {
    if (typeof other === 'number') {
        return new Complex(this.real + other, this.imag);
    }
    return new Complex(
        this.real + other.real,
        this.imag + other.imag
    );
}

/**
 * Complex subtraction
 */
subtract(other: Complex | number): Complex {
    if (typeof other === 'number') {
        return new Complex(this.real - other, this.imag);
    }
    return new Complex(
        this.real - other.real,
        this.imag - other.imag
    );
}

/**
 * Complex multiplication
 */
multiply(other: Complex | number): Complex {
    if (typeof other === 'number') {
        return new Complex(this.real * other, this.imag * other);
    }
    
    // (a + bi)(c + di) = (ac - bd) + (ad + bc)i
    return new Complex(
        this.real * other.real - this.imag * other.imag,
        this.real * other.imag + this.imag * other.real
    );
}

/**
 * Complex division
 */
divide(other: Complex | number): Complex {
    if (typeof other === 'number') {
        return new Complex(this.real / other, this.imag / other);
    }
    
    // (a + bi)/(c + di) = [(a + bi)(c - di)] / (c² + d²)
    const denominator = other.real * other.real + other.imag * other.imag;
    const conjugate = other.conjugate();
    const numerator = this.multiply(conjugate);
    
    return new Complex(
        (numerator.real as number) / denominator,
        (numerator.imag as number) / denominator
    );
}

/**
 * Complex exponentiation
 */
pow(exponent: number | Complex): Complex {
    if (typeof exponent === 'number') {
        if (exponent === 0) return new Complex(1, 0);
        if (exponent === 1) return this;
        
        // Convert to polar form for exponentiation
        const r = this.magnitude();
        const theta = this.phase();
        
        const newR = Math.pow(r, exponent);
        const newTheta = theta * exponent;
        
        return Complex.fromPolar(newR, newTheta);
    }
    
    throw new Error('Complex exponentiation with complex exponent not yet implemented');
}

/**
 * Natural logarithm of complex number
 */
log(): Complex {
    const r = this.magnitude();
    const theta = this.phase();
    
    return new Complex(Math.log(r), theta);
}

/**
 * Exponential function e^z
 */
static exp(z: Complex): Complex {
    const realExp = Math.exp(z.real as number);
    return new Complex(
        realExp * Math.cos(z.imag as number),
        realExp * Math.sin(z.imag as number)
    );
}

/**
 * Sine of complex number
 */
static sin(z: Complex): Complex {
    // sin(a + bi) = sin(a)cosh(b) + i cos(a)sinh(b)
    return new Complex(
        Math.sin(z.real as number) * Math.cosh(z.imag as number),
        Math.cos(z.real as number) * Math.sinh(z.imag as number)
    );
}

/**
 * Cosine of complex number
 */
static cos(z: Complex): Complex {
    // cos(a + bi) = cos(a)cosh(b) - i sin(a)sinh(b)
    return new Complex(
        Math.cos(z.real as number) * Math.cosh(z.imag as number),
        -Math.sin(z.real as number) * Math.sinh(z.imag as number)
    );
}

/**
 * Check if complex number is purely real
 */
isReal(): boolean {
    return this.imag === 0 || (typeof this.imag === 'number' && Math.abs(this.imag) < 1e-10);
}

/**
 * Check if complex number is purely imaginary
 */
isImaginary(): boolean {
    return this.real === 0 || (typeof this.real === 'number' && Math.abs(this.real) < 1e-10);
}

/**
 * Check if two complex numbers are equal (within tolerance)
 */
equals(other: Complex, tolerance: number = 1e-10): boolean {
    const realDiff = Math.abs((this.real as number) - (other.real as number));
    const imagDiff = Math.abs((this.imag as number) - (other.imag as number));
    
    return realDiff < tolerance && imagDiff < tolerance;
}

/**
 * String representation
 */
toString(): string {
    if (this.isReal()) {
        return this.real.toString();
    }
    
    if (this.isImaginary()) {
        return `${this.imag}i`;
    }
    
    const imagSign = (this.imag as number) >= 0 ? '+' : '-';
    const imagAbs = Math.abs(this.imag as number);
    
    return `${this.real} ${imagSign} ${imagAbs}i`;
}

/**
 * Convert to array [real, imag]
 */
toArray(): [number, number] {
    return [this.real as number, this.imag as number];
}

/**
 * Convert to polar coordinates [magnitude, angle]
 */
toPolar(): [number, number] {
    return [this.magnitude(), this.phase()];
}

}

/**

    Complex constants
    */
    const ComplexConstants = {
    I: new Complex(0, 1),
    ZERO: new Complex(0, 0),
    ONE: new Complex(1, 0),
    PI: new Complex(Math.PI, 0),
    E: new Complex(Math.E, 0)
    };

export { Complex, ComplexConstants };