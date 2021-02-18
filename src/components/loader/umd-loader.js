// umd-loader.js
//
// creates a standard loader
//
//
// create a template
const template = document.createElement('template');
template.innerHTML = `
    <style>
    :host {
        display: inline-block;
        width: 3.6rem;
        height: 3.6rem;
        background-repeat: no-repeat;
        background-size: 2.4rem 2.4rem;
        background-position: center;
        line-height: 3.6rem;
        font-size: var(--theme-font-size-S);
        font-weight: var(--theme-font-weight-normal);
        color: var(--theme-text-color);
        text-align: center;
        justify-self:center;
        background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItbG9hZGVyIj48bGluZSB4MT0iMTIiIHkxPSIyIiB4Mj0iMTIiIHkyPSI2Ij48L2xpbmU+PGxpbmUgeDE9IjEyIiB5MT0iMTgiIHgyPSIxMiIgeTI9IjIyIj48L2xpbmU+PGxpbmUgeDE9IjQuOTMiIHkxPSI0LjkzIiB4Mj0iNy43NiIgeTI9IjcuNzYiPjwvbGluZT48bGluZSB4MT0iMTYuMjQiIHkxPSIxNi4yNCIgeDI9IjE5LjA3IiB5Mj0iMTkuMDciPjwvbGluZT48bGluZSB4MT0iMiIgeTE9IjEyIiB4Mj0iNiIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjE4IiB5MT0iMTIiIHgyPSIyMiIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjQuOTMiIHkxPSIxOS4wNyIgeDI9IjcuNzYiIHkyPSIxNi4yNCI+PC9saW5lPjxsaW5lIHgxPSIxNi4yNCIgeTE9IjcuNzYiIHgyPSIxOS4wNyIgeTI9IjQuOTMiPjwvbGluZT48L3N2Zz4=");
        animation: rotation 2s infinite linear;
      }

      :host([hidden]) {
          display:none;
      }

      @keyframes rotation {
        from {
          transform: rotate(0deg);
          -ms-transform: rotate(0deg);
          -moz-transform: rotate(0deg);
        }
      
        to {
          transform: rotate(359deg);
          -ms-transform: rotate(359deg);
          -moz-transform: rotate(359deg);
        }
      }
    </style>
`

// create the custom element
export class UmdLoader extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'closed' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
  }

  // on adding to the DOM
  connectedCallback() {
  }


  // on being removed from DOM
  disconnectedCallback() {
  }
}
// register component 
window.customElements.define('umd-loader', UmdLoader);