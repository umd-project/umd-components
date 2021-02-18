// umd-component-image.js
//
// displays a image
//
// create a template
const template = document.createElement("template");
template.innerHTML = `
    <style>
      :host {  
        min-height: 3.2rem;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        display: grid;
        grid-template-rows: max-content;
        grid-template-columns: auto;
        align-items: center;
      }
      :host([hidden]) {
          display:none;
      }

    .fit {
        grid-row: 1;
        grid-column:1;
        width:100%; 
        object-fit:cover; 
    }

    .message {
        grid-row: 1;
        grid-column:1;
        width:100%; 
        text-align: center;
        font-size: 1.2rem;
    }
    </style>
    <img class="fit"/>
    <div class="message">Image will appear here</div>
`

// create the custom element
export class UmdComponentImage extends HTMLElement {
    static get observedAttributes() {
        return ["data-url", "data-source"];
    }

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: "closed" });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // on adding to the DOM
    connectedCallback() {
    }


    // attribute change
    attributeChangedCallback(name, oldVal, newVal) {
        newVal = (newVal === "undefined") ? "" : newVal;
        switch (name) {
            case "data-url":
                if (newVal) {
                    this._shadowRoot.querySelector(".message").setAttribute("hidden", "");
                    const _source = this.getAttribute("data-source");
                    if (_source == "include") {
                        this._setInternalImage(newVal);
                    }
                    else {
                        this._setLinkImage(newVal);
                    }
                }
                break;

            default:
                break;
        }
    }

    _setInternalImage(base64str) {
        this._shadowRoot.querySelector("img").src = `${base64str}`;
    }

    _setLinkImage(url) {
        this._shadowRoot.querySelector("img").src = `${url}`;
    }

    // on being removed from DOM
    disconnectedCallback() {
    }
}
// register component 
window.customElements.define("umd-component-image", UmdComponentImage);