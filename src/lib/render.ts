//src/lib/render.ts

import { Constant } from '../types/symbols';

/**
 * Mathematical expression renderer
 * Supports beautiful mathematical rendering with proper spacing and formatting
 */
class Render {
    private renderArr: Element[] = [];
    private mathElements: Map<string, Element> = new Map();

    constructor(containerSelector: string = 'div[app-type="math"]') {
        this.initialize(containerSelector);
    }

    /**
     * Initialize renderer and find all math containers
     */
    private initialize(selector: string): void {
        document.querySelectorAll(selector).forEach(element => {
            const id = element.id || `math-${this.mathElements.size + 1}`;
            if (!element.id) element.id = id;
            this.renderArr.push(element);
            this.mathElements.set(id, element);
        });
    }

    /**
     * Render mathematical expression to a specific container
     */
    render(data: string, id?: string): void {
        if (!data) {
            console.warn('No data provided for rendering');
            return;
        }

        if (id) {
            // Render to specific container
            this.renderToContainer(data, id);
        } else {
            // Render to all math containers
            this.renderArr.forEach(container => {
                this.renderToContainer(data, container.id);
            });
        }
    }

    /**
     * Render expression to a specific container by ID
     */
    private renderToContainer(data: string, id: string): void {
        const container = this.mathElements.get(id) || document.getElementById(id);
        
        if (!container) {
            console.error(`Container with id '${id}' not found`);
            return;
        }

        const renderedContent = this.parseMathExpression(data);
        container.innerHTML = renderedContent;
    }

    /**
     * Parse and convert mathematical expression to beautiful HTML
     */
    private parseMathExpression(expression: string): string {
        // Convert special symbols and handle mathematical notation
        let html = expression
            // Basic mathematical symbols
            .replace(/&int;/g, '<span class="math-symbol">∫</span>')
            .replace(/&sum;/g, '<span class="math-symbol">∑</span>')
            .replace(/&infin;/g, '<span class="math-symbol">∞</span>')
            .replace(/&pi;/g, '<span class="math-symbol">π</span>')
            .replace(/&theta;/g, '<span class="math-symbol">θ</span>')
            .replace(/&alpha;/g, '<span class="math-symbol">α</span>')
            .replace(/&beta;/g, '<span class="math-symbol">β</span>')
            .replace(/&gamma;/g, '<span class="math-symbol">γ</span>')
            .replace(/&delta;/g, '<span class="math-symbol">δ</span>')
            .replace(/&nabla;/g, '<span class="math-symbol">∇</span>')
            .replace(/&part;/g, '<span class="math-symbol">∂</span>')
            .replace(/&radic;/g, '<span class="math-symbol">√</span>')
            .replace(/&plusmn;/g, '<span class="math-symbol">±</span>')
            .replace(/&times;/g, '<span class="math-symbol">×</span>')
            .replace(/&divide;/g, '<span class="math-symbol">÷</span>')
            .replace(/&lt;/g, '<span class="math-symbol">&lt;</span>')
            .replace(/&gt;/g, '<span class="math-symbol">&gt;</span>')
            .replace(/&le;/g, '<span class="math-symbol">≤</span>')
            .replace(/&ge;/g, '<span class="math-symbol">≥</span>')
            .replace(/&ne;/g, '<span class="math-symbol">≠</span>')
            .replace(/&approx;/g, '<span class="math-symbol">≈</span>')
            .replace(/&prop;/g, '<span class="math-symbol">∝</span>')
            .replace(/&prime;/g, '<span class="math-symbol">′</span>')
            .replace(/&Prime;/g, '<span class="math-symbol">″</span>')
            
            // LaTeX-style fractions (must be done before parentheses)
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="math-fraction"><span class="math-numerator">$1</span><span class="math-denominator">$2</span></span>')
            
            // LaTeX-style parentheses
            .replace(/\\left\(/g, '<span class="math-paren math-paren-left">(</span>')
            .replace(/\\right\)/g, '<span class="math-paren math-paren-right">)</span>')
            .replace(/\\left\[/g, '<span class="math-paren math-paren-left">[</span>')
            .replace(/\\right\]/g, '<span class="math-paren math-paren-right">]</span>')
            
            // Subscript and superscript patterns
            .replace(/<sub>(.*?)<\/sub>/g, '<sub class="math-subscript">$1</sub>')
            .replace(/<sup>(.*?)<\/sup>/g, '<sup class="math-exponent">$1</sup>')
            .replace(/\^\{([^}]+)\}/g, '<sup class="math-exponent">$1</sup>')
            .replace(/\^(\w)/g, '<sup class="math-exponent">$1</sup>')
            .replace(/_\{([^}]+)\}/g, '<sub class="math-subscript">$1</sub>')
            .replace(/_(\w)/g, '<sub class="math-subscript">$1</sub>')
            
            // Handle existing <var> tags from input
            .replace(/<var>/g, '<var class="math-var">')
            
            // Variables - match single letters NOT already inside tags
            // This regex looks for single letters that are:
            // - Not preceded by < or / (not inside a tag)
            // - Not followed by = or > (not an attribute or closing tag)
            // - Word boundaries ensure we don't match parts of words
            .replace(/(?<!<[^>]*)\b([a-zA-Z])(?![a-zA-Z=>])/g, (match, letter, offset, string) => {
                // Check if we're inside a tag by looking backwards for < and >
                const beforeMatch = string.substring(0, offset);
                const lastOpenTag = beforeMatch.lastIndexOf('<');
                const lastCloseTag = beforeMatch.lastIndexOf('>');
                
                // If last < comes after last >, we're inside a tag
                if (lastOpenTag > lastCloseTag) {
                    return match;
                }
                
                return `<var class="math-var">${letter}</var>`;
            })
            
            // Simple fractions (a/b format) - only if not already in fraction tags
            .replace(/(?<!<[^>]*)(\w+)\/(\w+)(?![^<]*>)/g, (match, num, den, offset, string) => {
                // Check if already inside a tag
                const beforeMatch = string.substring(0, offset);
                const lastOpenTag = beforeMatch.lastIndexOf('<');
                const lastCloseTag = beforeMatch.lastIndexOf('>');
                
                if (lastOpenTag > lastCloseTag) {
                    return match;
                }
                
                return `<span class="math-fraction"><span class="math-numerator">${num}</span><span class="math-denominator">${den}</span></span>`;
            });

        // Now handle operators - but only outside of tags
        // Split by tags to process only text content
        const parts: string[] = [];
        let currentPos = 0;
        const tagRegex = /<[^>]+>/g;
        let tagMatch;
        
        while ((tagMatch = tagRegex.exec(html)) !== null) {
            // Add text before tag (with operator spacing)
            if (tagMatch.index > currentPos) {
                const textPart = html.substring(currentPos, tagMatch.index);
                parts.push(this.addOperatorSpacing(textPart));
            }
            // Add the tag as-is
            parts.push(tagMatch[0]);
            currentPos = tagMatch.index + tagMatch[0].length;
        }
        
        // Add remaining text
        if (currentPos < html.length) {
            const textPart = html.substring(currentPos);
            parts.push(this.addOperatorSpacing(textPart));
        }
        
        html = parts.join('');
        
        // Remove extra spaces and trim
        html = html.replace(/\s+/g, ' ').trim();

        // Wrap in math container
        return `<div class="math-expression">${html}</div>`;
    }

    /**
     * Add spacing around operators in text content only
     */
    private addOperatorSpacing(text: string): string {
        return text.replace(/([+\-*/=])/g, ' <span class="math-operator">$1</span> ');
    }
        /**
     * Render a symbolic expression tree with beautiful formatting
     */
    renderSymbolic(expr: any, id?: string): void {
        const html = this.symbolicToHTML(expr);
        this.render(html, id);
    }

    /**
     * Convert symbolic expression to beautiful HTML representation
     */
    private symbolicToHTML(expr: any): string {
        if (!expr) return '';

        // Handle different expression types
        if (expr instanceof Array) {
            return expr.map(e => this.symbolicToHTML(e)).join('');
        }

        if (typeof expr === 'object') {
            // Handle SymbolicExpression objects
            if (expr.operation) {
                return this.renderOperation(expr);
            }
            // Handle basic symbols
            if (expr.name && !(expr instanceof Constant)) {
                return `<var class="math-var">${expr.name}</var>`;
            }
            // Handle constants
            if (expr instanceof Constant) {
                return `<span class="math-number">${expr.name}</span>`;
            }
        }

        if (typeof expr === 'number') {
            return `<span class="math-number">${expr}</span>`;
        }

        if (typeof expr === 'string') {
            return this.parseMathExpression(expr);
        }

        return expr.toString();
    }

    /**
     * Render mathematical operations with beautiful formatting
     */
    private renderOperation(expr: any): string {
        const { operation, args } = expr;

        switch (operation) {
            case '+':
                return args.map((arg: any) => {
                    const argHtml = this.symbolicToHTML(arg);
                    // Add parentheses for complex expressions
                    return (arg.operation && arg.operation !== '+' && arg.operation !== '-') ? 
                           `<span class="math-group">(${argHtml})</span>` : argHtml;
                }).join(' <span class="math-operator">+</span> ');
            
            case '-':
                return args.map((arg: any, index: number) => {
                    const argHtml = this.symbolicToHTML(arg);
                    if (index === 0) return argHtml;
                    // Add parentheses for complex expressions being subtracted
                    return (arg.operation && arg.operation !== '+' && arg.operation !== '-') ? 
                           `<span class="math-operator">-</span> <span class="math-group">(${argHtml})</span>` :
                           `<span class="math-operator">-</span> ${argHtml}`;
                }).join(' ');
            
            case '*':
                // Implicit multiplication - no operator shown, just spacing
                return args.map((arg: any) => {
                    const argHtml = this.symbolicToHTML(arg);
                    // Add parentheses for complex expressions
                    return (arg.operation && (arg.operation === '+' || arg.operation === '-')) ? 
                           `<span class="math-group">(${argHtml})</span>` : argHtml;
                }).join(' ');
            
            case '/':
                return `<span class="math-fraction">
                    <span class="math-numerator">${this.symbolicToHTML(args[0])}</span>
                    <span class="math-denominator">${this.symbolicToHTML(args[1])}</span>
                </span>`;
            
            case '^':
                const base = this.symbolicToHTML(args[0]);
                const exponent = this.symbolicToHTML(args[1]);
                
                // Handle special cases for exponents
                if (args[1] instanceof Constant) {
                    const exponentValue = parseFloat(args[1].name);
                    if (exponentValue === 1) {
                        return base; // x^1 = x
                    }
                    if (exponentValue === 2) {
                        return `${base}<sup class="math-exponent math-squared">²</sup>`;
                    }
                    if (exponentValue === 3) {
                        return `${base}<sup class="math-exponent math-cubed">³</sup>`;
                    }
                }
                
                return `${base}<sup class="math-exponent">${exponent}</sup>`;
            
            default:
                return `<span class="math-function">${operation}</span><span class="math-group">(${args.map((arg: any) => this.symbolicToHTML(arg)).join(', ')})</span>`;
        }
    }

    /**
     * Add a new math container dynamically
     */
    addContainer(element: Element): void {
        const id = element.id || `math-${this.mathElements.size + 1}`;
        if (!element.id) element.id = id;
        
        this.renderArr.push(element);
        this.mathElements.set(id, element);
    }

    /**
     * Remove a math container
     */
    removeContainer(id: string): void {
        const index = this.renderArr.findIndex(el => el.id === id);
        if (index > -1) {
            this.renderArr.splice(index, 1);
        }
        this.mathElements.delete(id);
    }

    /**
     * Get all math container IDs
     */
    getContainerIds(): string[] {
        return Array.from(this.mathElements.keys());
    }

    /**
     * Clear all containers
     */
    clearAll(): void {
        this.renderArr.forEach(container => {
            container.innerHTML = '';
        });
    }
}

// Enhanced CSS styles for beautiful mathematical rendering
const mathStyles = `
<style>
/* Mathematical Expression Renderer Styles */
.math-expression {
  font-family: 'Cambria Math', 'Latin Modern Math', 'STIX Two Math', 'Asana Math', 
               'TeX Gyre Termes Math', 'Libertinus Math', 'Times New Roman', serif;
  font-size: 1.1em;
  line-height: 1.6;
  color: #2c3e50;
  text-align: center;
  margin: 1em 0;
  padding: 1em;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.math-expression:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

/* Mathematical Symbols */
.math-symbol {
  font-family: 'Cambria Math', 'STIX Two Math', 'Latin Modern Math', serif;
  font-size: 1.2em;
  font-weight: 600;
  color: #e74c3c;
  margin: 0 0.1em;
  padding: 0.1em 0.2em;
  background: rgba(231, 76, 60, 0.08);
  border-radius: 4px;
  display: inline-block;
  line-height: 1;
}

/* Variables */
.math-var {
  font-family: 'Cambria Math', 'STIX Two Math', 'Times New Roman', serif;
  font-style: italic;
  font-weight: 500;
  color: #2980b9;
  background: rgba(41, 128, 185, 0.08);
  padding: 0.1em 0.3em;
  margin: 0 0.1em;
  border-radius: 4px;
  display: inline-block;
  transition: all 0.2s ease;
}

.math-var:hover {
  background: rgba(41, 128, 185, 0.15);
  transform: scale(1.05);
}

/* Numbers */
.math-number {
  font-family: 'Cambria Math', 'STIX Two Math', monospace;
  font-weight: 600;
  color: #27ae60;
  background: rgba(39, 174, 96, 0.08);
  padding: 0.1em 0.4em;
  margin: 0 0.1em;
  border-radius: 4px;
  display: inline-block;
}

/* Operators */
.math-operator {
  font-family: 'Cambria Math', 'STIX Two Math', serif;
  font-weight: 700;
  color: #8e44ad;
  margin: 0 0.3em;
  padding: 0.1em 0.2em;
  background: rgba(142, 68, 173, 0.08);
  border-radius: 3px;
  display: inline-block;
  min-width: 0.8em;
  text-align: center;
}

/* Fractions */
.math-fraction {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0.4em;
  vertical-align: middle;
  position: relative;
}

.math-fraction::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #34495e 15%, #34495e 85%, transparent 100%);
  transform: translateY(-50%);
}

.math-numerator,
.math-denominator {
  padding: 0.1em 0.6em;
  text-align: center;
  z-index: 1;
}

.math-numerator {
  margin-bottom: 0.1em;
}

.math-denominator {
  margin-top: 0.1em;
}

/* Exponents and Subscripts */
.math-exponent {
  font-family: 'Cambria Math', 'STIX Two Math', serif;
  font-size: 0.75em;
  vertical-align: super;
  margin-left: 0.1em;
  color: #d35400;
  background: rgba(211, 84, 0, 0.08);
  padding: 0.1em 0.3em;
  border-radius: 2px;
  display: inline-block;
  line-height: 1;
}

.math-squared,
.math-cubed {
  font-family: 'Cambria Math', 'STIX Two Math', serif;
  font-weight: 600;
}

.math-subscript {
  font-family: 'Cambria Math', 'STIX Two Math', serif;
  font-size: 0.75em;
  vertical-align: sub;
  margin-left: 0.1em;
  color: #16a085;
  background: rgba(22, 160, 133, 0.08);
  padding: 0.1em 0.3em;
  border-radius: 2px;
  display: inline-block;
  line-height: 1;
}

/* Parentheses and Grouping */
.math-paren {
  font-family: 'Cambria Math', 'STIX Two Math', serif;
  font-size: 1.3em;
  font-weight: 400;
  color: #7f8c8d;
  margin: 0 0.1em;
}

.math-paren-left {
  margin-right: 0.05em;
}

.math-paren-right {
  margin-left: 0.05em;
}

.math-group {
  display: inline-block;
  margin: 0 0.1em;
}

/* Functions */
.math-function {
  font-family: 'Cambria Math', 'STIX Two Math', serif;
  font-style: italic;
  font-weight: 600;
  color: #c0392b;
  background: rgba(192, 57, 43, 0.08);
  padding: 0.1em 0.4em;
  margin-right: 0.2em;
  border-radius: 4px;
  display: inline-block;
}

/* Special mathematical elements */
.math-integral,
.math-summation,
.math-limit {
  font-size: 1.4em;
  margin: 0 0.2em;
}

/* Responsive Design */
@media (max-width: 768px) {
  .math-expression {
    font-size: 1em;
    padding: 0.8em;
    margin: 0.8em 0;
    border-radius: 8px;
  }
  
  .math-fraction {
    margin: 0 0.2em;
  }
  
  .math-numerator,
  .math-denominator {
    padding: 0.1em 0.4em;
  }
  
  .math-operator {
    margin: 0 0.2em;
  }
}

@media (max-width: 480px) {
  .math-expression {
    font-size: 0.9em;
    padding: 0.6em;
    margin: 0.6em 0;
    border-radius: 6px;
  }
  
  .math-symbol {
    font-size: 1.1em;
  }
  
  .math-fraction {
    margin: 0 0.1em;
  }
  
  .math-numerator,
  .math-denominator {
    padding: 0.05em 0.3em;
  }
  
  .math-exponent,
  .math-subscript {
    font-size: 0.7em;
  }
}

/* Print Styles */
@media print {
  .math-expression {
    background: none;
    border: 1px solid #ccc;
    box-shadow: none;
    color: #000;
  }
  
  .math-symbol {
    color: #000;
    background: none;
  }
  
  .math-var {
    color: #000;
    background: none;
  }
  
  .math-number {
    color: #000;
    background: none;
  }
  
  .math-operator {
    color: #000;
    background: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .math-expression {
    background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .math-symbol {
    color: #fc8181;
    background: rgba(252, 129, 129, 0.1);
  }
  
  .math-var {
    color: #63b3ed;
    background: rgba(99, 179, 237, 0.1);
  }
  
  .math-number {
    color: #68d391;
    background: rgba(104, 211, 145, 0.1);
  }
  
  .math-operator {
    color: #b794f4;
    background: rgba(183, 148, 244, 0.1);
  }
  
  .math-exponent {
    color: #f6ad55;
    background: rgba(246, 173, 85, 0.1);
  }
  
  .math-subscript {
    color: #4fd1c7;
    background: rgba(79, 209, 199, 0.1);
  }
}

/* Animation for dynamic updates */
@keyframes mathUpdate {
  0% {
    background-color: rgba(52, 152, 219, 0.2);
  }
  100% {
    background-color: transparent;
  }
}

.math-expression.updating {
  animation: mathUpdate 0.6s ease-in-out;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .math-expression {
    transition: none;
  }
  
  .math-expression:hover {
    transform: none;
  }
  
  .math-var:hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .math-expression {
    border: 2px solid currentColor;
    background: transparent;
  }
  
  .math-symbol,
  .math-var,
  .math-number,
  .math-operator,
  .math-exponent,
  .math-subscript {
    background: transparent;
    border: 1px solid currentColor;
  }
}
</style>
`;

// Inject styles into document
if (typeof document !== 'undefined') {
    document.head.insertAdjacentHTML('beforeend', mathStyles);
}

export { Render };