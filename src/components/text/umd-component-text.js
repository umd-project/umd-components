// umd-component-text.js
//
// creates an html / tex component
//

//
// create a template
const template = document.createElement('template');
template.innerHTML = `
    <style>
    :host {
        display: grid;
        grid-template-rows: max-content;
        grid-template-columns: auto;
        align-items: center;
        padding-left: 1.6rem !important;
        padding-right: 1.6rem !important;
        padding-top: 1.6rem !important;
        padding-bottom: 1.6rem !important;
    }
    :host([disabled]) {
        color: var(--theme-message-color);    
    }

    :host([hidden]) {
        display:none;
    }  

    .html {
        grid-row: 1;
        border: 0;
    }

    </style>
    <div class="html"></div>
`

// create the custom element
export class UmdComponentText extends HTMLElement {
    static get observedAttributes() {
        return ['data-url'];
    }

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'closed' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // on adding to the DOM
    connectedCallback() {
    }

    // attribute change
    attributeChangedCallback(name, oldVal, newVal) {
        newVal = (newVal === "undefined") ? '' : newVal;
        switch (name) {
            case 'data-url':
                if (newVal) {
                    this._loadFile(newVal);
                }
                break;
            default:
                break;    
        }
    }


    _loadFile(url) {
        fetch(url)
            .then(resp => {
                return resp.text();
            })
            .then(t => {
                const _ele = this._stringToHTML(t);
                this._shadowRoot.querySelector('.html').innerHTML = _ele.innerHTML;
            })
    }

    _support() {
        if (!window.DOMParser) return false;
        var parser = new DOMParser();
        try {
            parser.parseFromString('x', 'text/html');
        } catch (err) {
            return false;
        }
        return true;
    };

    _stringToHTML(str) {
        // If DOMParser is supported, use it
        if (this._support) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(str, 'text/html');
            return doc.body;
        }

        // Otherwise, fallback to old-school method
        var dom = document.createElement('div');
        dom.innerHTML = str;
        return dom;
    };

    // on being removed from DOM
    disconnectedCallback() {
    }
}
// register component 
window.customElements.define('umd-component-text', UmdComponentText);