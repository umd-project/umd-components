// umd-component-form.js
//
// displays a form
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

      .form {
        grid-row: 1;
        grid-column:1;
        width:100%;
      }
    </style>
    <iframe class="form" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen width="100%"></iframe>
`

// create the custom element
export class UmdComponentForm extends HTMLElement {
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

    observer.observe(this._shadowRoot.querySelector('.form'));

  }

  // on adding to the DOM
  connectedCallback() {
    this._loadForm();
  }

  _calibrateWH() {
    const _form = this._shadowRoot.querySelector('.form');

    // calibrate h and w
    const w = this.offsetWidth;
    const _aspect = this.getAttribute('data-aspect');
    let h2w = 1.414 / 1; // A4 size ratio
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
    _form.setAttribute('width', `${w}px`);
    _form.setAttribute('height', `${h}px`);
  }

  _loadForm() {
    // get the attributes
    const _url = this.getAttribute('data-url');
    // check if url provided
    if (!_url) return;


    let _source = 'embed'; // default
    if (this.getAttribute('data-source')) {
      _source = this.getAttribute('data-source');
    }

    switch (_source) {

      case 'embed':
        this._loadEmbedForm(_url);
        break;
    }
  }

  _loadEmbedForm(url) {
    const _form = this._shadowRoot.querySelector('.form');
    _form.src = this.parseUrl(url); //url;
  }

  parseUrl(url)  {
    const _url = new URL(url);
    const _origin = _url.origin.toLowerCase();
    const _pathname = _url.pathname;
    switch(_origin) {
        case "https://docs.google.form":
        case "https://forms.gle":
            return `${_origin}${_pathname}?embedded=true`;
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
window.customElements.define('umd-component-form', UmdComponentForm);