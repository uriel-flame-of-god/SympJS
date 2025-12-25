/**
 * Fourier Series Expansion Implementation
 * 
 * This class provides functionality to compute and work with Fourier series expansions
 * of periodic functions. It supports both standard and complex Fourier series.
 */

import { Complex } from '../types/complex';

export interface FourierCoefficients {
    a0: number;
    an: number[];
    bn: number[];
}

export interface ComplexFourierCoefficients {
    cn: Complex[];
}

export class FourierSeries {
    private period: number;
    protected coefficients: FourierCoefficients;
    private complexCoefficients?: ComplexFourierCoefficients;
    private isComplex: boolean;

    constructor(period: number = 2 * Math.PI) {
        this.period = period;
        this.coefficients = { a0: 0, an: [], bn: [] };
        this.isComplex = false;
    }

    /**
     * Compute Fourier coefficients for a function using numerical integration
     */
    computeCoefficients(
        func: (x: number) => number,
        numHarmonics: number,
        integrationPoints: number = 1000
    ): void {
        this.isComplex = false;
        this.coefficients = { a0: 0, an: [], bn: [] };

        // For standard Fourier series, integrate over [-period/2, period/2]
        const halfPeriod = this.period / 2;
        
        // Compute a0 coefficient (1/L * integral over one period)
        this.coefficients.a0 = (1 / halfPeriod) * this.integrate(func, -halfPeriod, halfPeriod, integrationPoints);

        // Compute an and bn coefficients
        for (let n = 1; n <= numHarmonics; n++) {
            const nOmega = (n * Math.PI) / halfPeriod;
            
            const anFunc = (x: number) => func(x) * Math.cos(nOmega * x);
            const bnFunc = (x: number) => func(x) * Math.sin(nOmega * x);
            
            const an = (1 / halfPeriod) * this.integrate(anFunc, -halfPeriod, halfPeriod, integrationPoints);
            const bn = (1 / halfPeriod) * this.integrate(bnFunc, -halfPeriod, halfPeriod, integrationPoints);
            
            this.coefficients.an.push(an);
            this.coefficients.bn.push(bn);
        }
    }

    /**
     * Compute complex Fourier coefficients
     */
    computeComplexCoefficients(
        func: (x: number) => Complex,
        numHarmonics: number,
        integrationPoints: number = 1000
    ): void {
        this.isComplex = true;
        this.complexCoefficients = { cn: [] };

        for (let n = -numHarmonics; n <= numHarmonics; n++) {
            const nOmega = (2 * Math.PI * n) / this.period;
            
            const cnFunc = (x: number) => {
                const expTerm = new Complex(Math.cos(nOmega * x), -Math.sin(nOmega * x));
                return func(x).multiply(expTerm);
            };
            
            const cn = this.integrateComplex(cnFunc, 0, this.period, integrationPoints);
            const normalizedCn = new Complex(cn.real / this.period, cn.imag / this.period);
            this.complexCoefficients.cn.push(normalizedCn);
        }
    }

    /**
     * Evaluate the Fourier series at a given point
     */
    evaluate(x: number): number {
        if (this.isComplex) {
            throw new Error("Cannot evaluate complex Fourier series as real number. Use evaluateComplex instead.");
        }

        const halfPeriod = this.period / 2;
        let result = this.coefficients.a0 / 2;
        
        for (let n = 0; n < this.coefficients.an.length; n++) {
            const nOmega = ((n + 1) * Math.PI) / halfPeriod;
            result += this.coefficients.an[n] * Math.cos(nOmega * x);
            result += this.coefficients.bn[n] * Math.sin(nOmega * x);
        }
        
        return result;
    }

    /**
     * Evaluate the complex Fourier series at a given point
     */
    evaluateComplex(x: number): Complex {
        if (!this.isComplex || !this.complexCoefficients) {
            throw new Error("Complex coefficients not computed. Use computeComplexCoefficients first.");
        }

        let result = new Complex(0, 0);
        const numHarmonics = (this.complexCoefficients.cn.length - 1) / 2;
        
        for (let n = -numHarmonics; n <= numHarmonics; n++) {
            const nOmega = (2 * Math.PI * n) / this.period;
            const expTerm = new Complex(Math.cos(nOmega * x), Math.sin(nOmega * x));
            const cn = this.complexCoefficients.cn[n + numHarmonics];
            result = result.add(cn.multiply(expTerm));
        }
        
        return result;
    }

    /**
     * Get the coefficients
     */
    getCoefficients(): FourierCoefficients | ComplexFourierCoefficients {
        return this.isComplex ? this.complexCoefficients! : this.coefficients;
    }

    /**
     * Get the number of harmonics
     */
    getNumHarmonics(): number {
        return this.isComplex 
            ? (this.complexCoefficients?.cn.length ? (this.complexCoefficients.cn.length - 1) / 2 : 0)
            : this.coefficients.an.length;
    }

    /**
     * Set the period of the function
     */
    setPeriod(period: number): void {
        this.period = period;
    }

    /**
     * Get the period of the function
     */
    getPeriod(): number {
        return this.period;
    }

    /**
     * Get the fundamental frequency
     */
    getFundamentalFrequency(): number {
        return Math.PI / (this.period / 2);
    }

    /**
     * Numerical integration using Simpson's rule
     */
    private integrate(
        func: (x: number) => number,
        a: number,
        b: number,
        n: number
    ): number {
        if (n % 2 !== 0) n++; // Ensure n is even for Simpson's rule
        
        const h = (b - a) / n;
        let sum = func(a) + func(b);
        
        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            const coefficient = i % 2 === 0 ? 2 : 4;
            sum += coefficient * func(x);
        }
        
        return (h / 3) * sum;
    }

    /**
     * Numerical integration for complex functions
     */
    private integrateComplex(
        func: (x: number) => Complex,
        a: number,
        b: number,
        n: number
    ): Complex {
        if (n % 2 !== 0) n++; // Ensure n is even for Simpson's rule
        
        const h = (b - a) / n;
        let sumReal = func(a).real + func(b).real;
        let sumImag = func(a).imag + func(b).imag;
        
        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            const value = func(x);
            const coefficient = i % 2 === 0 ? 2 : 4;
            sumReal += coefficient * value.real;
            sumImag += coefficient * value.imag;
        }
        
        return new Complex((h / 3) * sumReal, (h / 3) * sumImag);
    }

    /**
     * Get the amplitude spectrum (magnitude of complex coefficients)
     */
    getAmplitudeSpectrum(): number[] {
        if (!this.isComplex || !this.complexCoefficients) {
            throw new Error("Complex coefficients not computed.");
        }

        return this.complexCoefficients.cn.map(cn => cn.magnitude());
    }

    /**
     * Get the phase spectrum (phase of complex coefficients)
     */
    getPhaseSpectrum(): number[] {
        if (!this.isComplex || !this.complexCoefficients) {
            throw new Error("Complex coefficients not computed.");
        }

        return this.complexCoefficients.cn.map(cn => cn.phase());
    }

    /**
     * Convert real coefficients to complex coefficients
     */
    toComplexCoefficients(): ComplexFourierCoefficients {
        const numHarmonics = this.coefficients.an.length;
        const cn: Complex[] = [];
        
        // c0 = a0/2
        cn.push(new Complex(this.coefficients.a0 / 2, 0));
        
        // Positive harmonics
        for (let n = 1; n <= numHarmonics; n++) {
            const cn_real = this.coefficients.an[n - 1] / 2;
            const cn_imag = -this.coefficients.bn[n - 1] / 2;
            cn.push(new Complex(cn_real, cn_imag));
        }
        
        // Negative harmonics (complex conjugates)
        for (let n = -numHarmonics; n < 0; n++) {
            const idx = Math.abs(n);
            const cn_real = this.coefficients.an[idx - 1] / 2;
            const cn_imag = this.coefficients.bn[idx - 1] / 2;
            cn.unshift(new Complex(cn_real, cn_imag));
        }
        
        return { cn };
    }

    /**
     * Clear all coefficients
     */
    clear(): void {
        this.coefficients = { a0: 0, an: [], bn: [] };
        this.complexCoefficients = undefined;
        this.isComplex = false;
    }

    /**
     * Create a Fourier series from predefined coefficients
     */
    static fromCoefficients(
        coefficients: FourierCoefficients,
        period: number = 2 * Math.PI
    ): FourierSeries {
        const series = new FourierSeries(period);
        series.coefficients = coefficients;
        series.isComplex = false;
        return series;
    }

    /**
     * Create a Fourier series from predefined complex coefficients
     */
    static fromComplexCoefficients(
        coefficients: ComplexFourierCoefficients,
        period: number = 2 * Math.PI
    ): FourierSeries {
        const series = new FourierSeries(period);
        series.complexCoefficients = coefficients;
        series.isComplex = true;
        return series;
    }
}

/**
 * Utility functions for common Fourier series
 */
export class FourierUtils {
    /**
     * Create a Fourier series for a square wave
     */
    static squareWave(amplitude: number = 1, period: number = 2 * Math.PI): FourierSeries {
        const numHarmonics = 10; // Default number of harmonics
        const coefficients: FourierCoefficients = { a0: 0, an: [], bn: [] };
        
        for (let n = 1; n <= numHarmonics; n++) {
            if (n % 2 === 1) { // Only odd harmonics
                coefficients.an.push(0);
                coefficients.bn.push((4 * amplitude) / (n * Math.PI));
            } else {
                coefficients.an.push(0);
                coefficients.bn.push(0);
            }
        }
        
        return FourierSeries.fromCoefficients(coefficients, period);
    }

    /**
     * Create a Fourier series for a sawtooth wave
     */
    static sawtoothWave(amplitude: number = 1, period: number = 2 * Math.PI): FourierSeries {
        const numHarmonics = 10;
        const coefficients: FourierCoefficients = { a0: 0, an: [], bn: [] };
        
        for (let n = 1; n <= numHarmonics; n++) {
            coefficients.an.push(0);
            coefficients.bn.push((-2 * amplitude) / (n * Math.PI) * Math.pow(-1, n));
        }
        
        return FourierSeries.fromCoefficients(coefficients, period);
    }

    /**
     * Create a Fourier series for a triangle wave
     */
    static triangleWave(amplitude: number = 1, period: number = 2 * Math.PI): FourierSeries {
        const numHarmonics = 10;
        const coefficients: FourierCoefficients = { a0: 0, an: [], bn: [] };
        
        for (let n = 1; n <= numHarmonics; n++) {
            if (n % 2 === 1) { // Only odd harmonics
                // Triangle wave: (8*amplitude/π²) * Σ[(-1)^((n-1)/2) / n² * cos(nπx/L)]
                const coeff = (8 * amplitude) / (Math.pow(n * Math.PI, 2)) * Math.pow(-1, (n - 1) / 2);
                coefficients.an.push(coeff);
                coefficients.bn.push(0);
            } else {
                coefficients.an.push(0);
                coefficients.bn.push(0);
            }
        }
        
        return FourierSeries.fromCoefficients(coefficients, period);
    }
}