// umd-component-presentation.js
//
// displays a presentation
//

//
// create a template
const template = document.createElement('template');
template.innerHTML = `
    <style>
      :host {
        display:grid;
        grid-template-rows: max-content;
        grid-template-columns: auto;
      }

      :host([hidden]) {
        display:none;
      }

      [hidden] {
        display: none !important;
      }

      .dummy {
        grid-row: 1;
        grid-column: 1;
      }

      .presentation {
        grid-row: 1;
        grid-column:1;
        width:100%;
      }
    </style>
    <iframe class="presentation" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen width="100%"></iframe>
`

// create the custom element
export class UmdComponentPresentation extends HTMLElement {
  static get observedAttributes() {
    return ['data-source', 'data-url', 'data-aspect'];
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    const observer = new IntersectionObserver((entry, observer) => {
      this._calibrateWH();
    });

    observer.observe(this._shadowRoot.querySelector('.presentation'));

  }

  // on adding to the DOM
  connectedCallback() {
    this._loadPresentation();
  }

  _calibrateWH() {
    const _presentation = this._shadowRoot.querySelector('.presentation');

    // calibrate h and w
    const w = this.offsetWidth;
    const _aspect = this.getAttribute('data-aspect');
    let h2w = 9 / 16; // default ratio
    if (_aspect) {
      const _aspectarr = _aspect.split(':');
      if (_aspectarr.length == 2) {
        const _aspectW = parseFloat(_aspectarr[0]);
        const _aspectH = parseFloat(_aspectarr[1]);
        if (_aspectW != 0 && _aspectH != 0) {
          h2w = _aspectH / _aspectW;
        }
      }
    }
    let h = parseInt(w * h2w);
    _presentation.setAttribute('width', `${w}px`);
    _presentation.setAttribute('height', `${h}px`);
  }

  _loadPresentation() {
    // get the attributes
    const _url = this.getAttribute('data-url');
    // check if url provided
    if (!_url) return;

    this._loadEmbedPresentation(_url);
  }

  _loadEmbedPresentation(url) {
    const _presentation = this._shadowRoot.querySelector('.presentation');
    _presentation.src = this.parseUrl(url); //url;
  }

  parseUrl(url)  {
    const _url = new URL(url);
    const _origin = _url.origin.toLowerCase();
    let _pathname = _url.pathname;
    const _search = _url.search;
    switch(_origin) {
        case "https://docs.google.com":
            _pathname = _pathname.replace("/pub", "/embed");
            return `${_origin}${_pathname}${_search}`;
        default:
            return url;    
    }
}



  // attribute change
  attributeChangedCallback(name, oldVal, newVal) {
  }

  // on being removed from DOM
  disconnectedCallback() {
  }
}
// register component 
window.customElements.define('umd-component-presentation', UmdComponentPresentation);