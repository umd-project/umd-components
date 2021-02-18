// umd-pdf.js
//
// displays pdf
//
import { UmdLoader } from '../loader/umd-loader.js';

//
// create a template
const template = document.createElement('template');
template.innerHTML = `
    <style>
    :host {
        display:grid;
        grid-auto-rows: max-content;
        grid-template-columns:auto;
        grid-row-gap: 0.8rem;
        overflow-x: hidden;
        background-color: #f1f1f1;
    }

    :host([hidden]), [hidden] {
        display:none !important;
    }

    .embed {
        grid-row: 1;
        grid-column:1;
        background-color: #fff;
    }

    .loader {
        grid-row:1/-1; 
        grid-column:1; 
        align-self: center;
        justify-self: center;
    }


    </style>    
    <umd-loader class="loader"></umd-loader>
`

// create the custom element
export class UmdComponentPdf extends HTMLElement {
    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));

        // set pdf library file src
        this._pdfsrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/build/pdf.min.js';
        this._workersrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/build/pdf.worker.min.js';        

        this._loaded = false;
        if(typeof pdfjsLib != "undefined") {
            this._loaded = true;
        }
    }

    // on adding to the DOM
    connectedCallback() {
        this.checkNload();
    }

    async checkNload() {
        if (!this._loaded) {
            await this._loadScript();
            this._loaded = true;
        }    
        this._loadPDF();
    }


    _loadScript() {
        return new Promise(resolve => {
            const script = document.createElement('script');
            script.onload = () => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = this._workersrc;
                resolve();
            }
            script.src = this._pdfsrc;
            document.head.append(script);
        });
    }

    async _loadPDF() {
        const path = this.getAttribute('data-url');
        if(!path) return;

        const loadingTask = pdfjsLib.getDocument(path);
        const pdf = await loadingTask.promise;

        for (let i = 1; i <= pdf.numPages; i++) {
            await this._addPage(pdf, i);
        }
        this._shadowRoot.querySelector('.loader').setAttribute('hidden', '');
    }

    async _addPage(pdf, pgno) {
        const page = await pdf.getPage(pgno);

        // get ratio of page using scale 1
        const viewport = page.getViewport({ scale: 1 });
        const h2w = viewport.height / viewport.width;

        // set the canvas
        const canvas = document.createElement('canvas');
        canvas.classList.add('embed');
        canvas.style.gridRow = pgno;
        canvas.width = this.offsetWidth;
        canvas.height = h2w * this.offsetWidth;
        // determine the scale
        let pdfScale = 1;
        if (viewport.width > canvas.width) {
            pdfScale = canvas.width / viewport.width;
        }

        // get canvas context
        const context = canvas.getContext("2d");

        // get revised port
        const pdfport = page.getViewport({ scale: pdfScale });

        // Render the page into the canvas
        const renderContext = {
            canvasContext: context,
            viewport: pdfport
        };
        await page.render(renderContext);
        this.shadowRoot.appendChild(canvas);
    }

    // attribute change
    attributeChangedCallback(name, oldVal, newVal) {
    }

    // on being removed from DOM
    disconnectedCallback() {
    }
}
// register component 
window.customElements.define('umd-component-pdf', UmdComponentPdf);