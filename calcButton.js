﻿const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: inline-block;
        }
        button {
            font-family: Digital;
            display: inline-block;
            width: 6rem;
            height: 6rem;
            font-size: 3rem;
            font-weight: bold; 
            cursor: pointer;
            transition: scale 0.2s ease, background-color 0.2s ease;
            background-color: #1a1a1a;
            border: solid 1px #535353;
        }
        button:hover {
            scale: 1.05; 
            background-color: #3c1414; 
        } 
    </style>
    <button><slot></slot></button>
`;
class CalcButton extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'closed'});
        this.shadow.append(template.content.cloneNode(true));
        this.button = this.shadow.querySelector('button');
        this.button.addEventListener('click', this);
        console.log();
    }

    connectedCallback() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                console.log(mutation);
                if (mutation.addedNodes.length) {
                    for (const node of mutation.addedNodes) {
                        this.shadow.appendChild(node);
                    }
                }
            }
        });

        observer.observe(this, {childList: true});
    }

    handleEvent(event) {
        if (event instanceof MouseEvent) {
            const func = this.attributes.getNamedItem("function")?.value;
            if (typeof func === 'string') {
                this.dispatchEvent(new CustomEvent('operator', {detail: func}));
                return;
            }

            const digit = this.attributes.getNamedItem("digit")?.value;
            if (typeof digit === 'string') {
                this.dispatchEvent(new CustomEvent('digit', {detail: digit}));
            }
        }
    }
}

customElements.define('calc-button', CalcButton);
