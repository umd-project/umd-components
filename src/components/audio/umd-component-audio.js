// umd-component-audio.js
//
// creates an audio component
//
// imports
import { UmdLoader } from '../loader/umd-loader.js';

//
// create a template
const template = document.createElement('template');
template.innerHTML = `
    <style>
    :host {
        min-height: 3.2rem;
        display: grid;
        grid-template-rows: max-content;
        grid-template-columns: auto;
        align-items: center;
    }
    :host([disabled]) {
        color: var(--theme-message-color);    
    }

    :host([hidden]) {
        display:none;
    }  

    .loader, .audio {
        grid-row: 1;
        grid-column:1;
        align-self: center;
        justify-self: center;
    }

    .audio {
        outline: none;
        border: 0;
    }

    .audio:focus {
        outline: none;
        border: 0;
    }

    </style>
    <audio class="audio" controls controlsList="nodownload" hidden>Audio</audio>
    <umd-loader class="loader" hidden></umd-loader>
`

// create the custom element
export class UmdComponentAudio extends HTMLElement {
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
                    this._setAudio(newVal);
                }
                break;

           default:
                break;
        }
    }

    async _setAudio(url) {
        const _loader = this._shadowRoot.querySelector('.loader');
        const _audio = this._shadowRoot.querySelector('audio');
        _loader.removeAttribute('hidden');
        _audio.onloadeddata = function () {
            _audio.removeAttribute('hidden');
            _loader.setAttribute('hidden', '');
        };
        _audio.src = url;
    }

    stopAudio() {
        const _ele = this._shadowRoot.querySelector('audio');
        if (_ele) _ele.src = '';
    }

    // on being removed from DOM
    disconnectedCallback() {
    }
}
// register component 
window.customElements.define('umd-component-audio', UmdComponentAudio);