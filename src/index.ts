import { symbols, diff } from "./types/symbols";
import { Render } from "./lib/render";
import { Simplifier, EquationSolver, Matrix } from "./lib/algebra";
import { Complex, ComplexConstants } from "./types/complex";
import { TaylorSeries } from "./lib/taylor";
import { sin, cos, tan, cot, sec, csc, asin, acos, atan, simplifyTrig, pi } from "./types/trigonometry";
import { FourierSeries, FourierUtils } from "./lib/fourier";
import type { FourierCoefficients, ComplexFourierCoefficients } from "./lib/fourier";
// Types
export type { FourierCoefficients, ComplexFourierCoefficients };

// Values (functions, classes, constants)
export {symbols, diff, Render, Simplifier, EquationSolver, Matrix, Complex, ComplexConstants, TaylorSeries, sin, cos, tan, cot, sec, csc, asin, acos, atan, simplifyTrig, pi, FourierSeries, FourierUtils};