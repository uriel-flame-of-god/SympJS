//src/main.ts
import { symbols, diff } from "./types/symbols";
import { Render } from "./lib/render";

window.addEventListener("DOMContentLoaded", () => {
    // Initialize renderer
    const renderer = new Render();

    const [x, y] = symbols('x', 'y');

    // Example 1: Basic mathematical expressions
    const expr1 = x.pow(2).add(y.mul(3)); // x² + 3y
    const derivative1 = diff(expr1, x); // 2x

    // Render to specific container
    renderer.renderSymbolic(expr1, 'math-container-1');
    renderer.renderSymbolic(derivative1, 'math-container-2');

    // Example 2: Using HTML and symbols
    renderer.render('∫<var>x</var>² d<var>x</var> = <var>x</var>³/3 + C', 'math-container-3');
    renderer.render('∑<sub>i=1</sub><sup>n</sup> i = n(n+1)/2', 'math-container-4');
    renderer.render('&part;f/&part;x = 2x + 3y', 'math-container-5');

    // Example 3: Complex expressions with fractions
    renderer.render('\\frac{d}{dx} \\left( \\frac{x^2 + 1}{x - 1} \\right)', 'math-container-6');

    // Example 4: Render to all math containers
    //renderer.render('This appears in all math containers');

    console.log('Available containers:', renderer.getContainerIds());
});