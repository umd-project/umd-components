// umd-component-markdown.js
//
// creates an markdown component
//
// imports
import MarkdownIt from './markdown-it.min.js';

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

    code {
        background-color: #efefef;
        line-height: 1.25;
    }

    pre {
        background-color: #efefef;
        padding-top: 0.8rem;
        padding-bottom: 0.8rem;
        padding-left: 1.6rem;
        padding-right: 1.6rem;
    }

    table {
        width: 100%;
        border-spacing: 0.4rem;
        border-collapse: collapse;
    }

    th {
        border-bottom: solid 2px #ccc;
        border-top: solid 1px #eee;
        line-height: 2;
        text-align: left;
    }

    td {
        line-height: 1.5;
    }

    </style>
    <div class="html"></html>
`

// create the custom element
export class UmdComponentMd extends HTMLElement {
    static get observedAttributes() {
        return ['data-text', 'data-url'];
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
            case 'data-text':
                if (newVal) {
                    this._convertText(newVal);
                }
                break;
            case 'data-url':
                if (newVal) {
                    this._loadFile(newVal);
                }
                break;
            default:
                break;    
        }
    }

    _convertText(t) {
        const md = new MarkdownIt();
        this._shadowRoot.querySelector('.html').innerHTML = md.render(t);
    }

    _loadFile(url) {
        fetch(url)
            .then(resp => {
                return resp.text();
            })
            .then(t => {
                this._convertText(t);
            })
    }

    // on being removed from DOM
    disconnectedCallback() {
    }
}

// register component 
window.customElements.define('umd-component-md', UmdComponentMd);