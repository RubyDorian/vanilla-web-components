const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: inline-block;
            font-family: Digital;
        }
        :host > .buttons > .block {
            display: grid;
            justify-content: start; 
            grid-template-columns: repeat(4, auto);
            margin: 20px;  
        }
        :host > .log {
            font-size: 2rem;
            height: 14rem;
            overflow-y: auto;  
        } 
        :host > .current-value {
            font-size: 4rem;
        } 
    </style>
    <div class="log"></div> 
    <div class="current-value"></div> 
    <div class="buttons">
        <div class="block"> 
            <calc-button digit="1">1</calc-button>
            <calc-button digit="2">2</calc-button>
            <calc-button digit="3">3</calc-button>
            <calc-button digit="4">4</calc-button>
            <calc-button digit="5">5</calc-button>
            <calc-button digit="6">6</calc-button>
            <calc-button digit="7">7</calc-button>
            <calc-button digit="8">8</calc-button>
            <calc-button digit="9">9</calc-button>
            <calc-button digit="0">0</calc-button>
        </div> 
        <div class="block"> 
            <calc-button function="add">+</calc-button>
            <calc-button function="sub">-</calc-button>
            <calc-button function="multiply">*</calc-button>
            <calc-button function="divide">/</calc-button>
        </div> 
        <div class="block"> 
            <calc-button function="backspace">◀️</calc-button>
            <calc-button function="reset">C</calc-button>
            <calc-button function="equal">=</calc-button>
        </div> 
    </div>
`;
class Calculator extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'closed'});
        this.shadow.append(template.content.cloneNode(true));

        this.buttons = this.shadow.querySelectorAll('calc-button');
        this.buttons.forEach(button => {
            button.addEventListener('operator', this);
            button.addEventListener('digit', this);
        });

        this._logLines = [];
        this._operatorStack = null;

        this.log = this.shadow.querySelector('.log');
        this.currentValue = this.shadow.querySelector('.current-value');
        this.curValue = '';
    }

    get curValue() {
        return this._curValue;
    }

    set curValue(value) {
        this._curValue = value;
        if (this._curValue === '') {
            this.currentValue.innerHTML = '&nbsp;';
        } else {
            this.currentValue.innerText = this._curValue;
        }
    }

    get logLines() {
        return this._logLines;
    }

    set logLines(value) {
        this._logLines = value;
        this.log.innerText = this._logLines.join('\n');
        this.log.scrollTo(0, this.log.scrollHeight);
    }

    putDigit(digit) {
        console.log('digit', digit);
        this.curValue += digit;
    }

    execOperator(operator) {
        console.log('operator', operator);
        switch (operator) {
            case 'add':
                this.logLines = [...this.logLines, this.curValue];
                this.logLines = [...this.logLines, '+'];
                this._operatorStack = {operator: operator, value: this.curValue};
                this.curValue = '';
                break;
            case 'sub':
                this.logLines = [...this.logLines, this.curValue];
                this.logLines = [...this.logLines, '-'];
                this._operatorStack = {operator: operator, value: this.curValue};
                this.curValue = '';
                break;
            case 'multiply':
                this.logLines = [...this.logLines, this.curValue];
                this.logLines = [...this.logLines, '*'];
                this._operatorStack = {operator: operator, value: this.curValue};
                this.curValue = '';
                break;
            case 'divide':
                this.logLines = [...this.logLines, this.curValue];
                this.logLines = [...this.logLines, '/'];
                this._operatorStack = {operator: operator, value: this.curValue};
                this.curValue = '';
                break;
            case 'backspace':
                if (this.curValue.length > 0) {
                    this.curValue = this.curValue.slice(0, this.curValue.length - 1);
                }
                break;
            case 'equal':
                if (!this._operatorStack) {
                    return;
                }
                this.logLines = [...this.logLines, this.curValue];
                const firstValue = parseInt(this._operatorStack.value, 10);
                const curValue = parseInt(this.curValue, 10);
                switch (this._operatorStack.operator) {
                    case 'add':
                        this.curValue = (firstValue + curValue).toString();
                        break;
                    case 'sub':
                        this.curValue = (firstValue - curValue).toString();
                        break;
                    case 'multiply':
                        this.curValue = (firstValue * curValue).toString();
                        break;
                    case 'divide':
                        this.curValue = (firstValue / curValue).toString();
                        break;
                }
                this.logLines = [...this.logLines, `=${this.curValue}`];
                this._operatorStack = null;
                break;
            case 'reset':
                this.curValue = '';
                break;
        }
    }

    handleEvent(event) {
        switch (event.type) {
            case 'digit':
                this.putDigit(event.detail);
                break;
            case 'operator':
                this.execOperator(event.detail);
                break;
        }
    }
}

customElements.define('calculator-container', Calculator);
