// umd-component-video.js
//
// displays video
//
// imports
import { UmdLoader } from "../loader/umd-loader.js";

//
// create a template
const template = document.createElement("template");
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

      iframe {
        grid-row: 1;
        grid-column:1;
        object-fit: contain;
        width:100%;
      }

      .video {
        grid-row: 1;
        grid-column:1;
        object-fit: contain;
        width:100%;
      }
  
      .loader {
        grid-row:1;
        grid-column:1;
        align-self: center;
        justify-self: center;
      }

    </style>
    <video class="video" controls hidden></video>
    <iframe frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen hidden></iframe>
    <umd-loader class="loader" hidden></umd-loader>
`

// create the custom element
export class UmdComponentVideo extends HTMLElement {
  static get observedAttributes() {
    return ["data-source", "data-url", "data-aspect"];
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));


    const observer = new IntersectionObserver((entry, observer) => {
      this._calibrateWH();
    });

    observer.observe(this._shadowRoot.querySelector("iframe"));
  }

  // on adding to the DOM
  connectedCallback() {
    this._loadVideo();
  }

  _loadVideo() {
    this._shadowRoot.querySelector("video").setAttribute("hidden", "");
    this._shadowRoot.querySelector("iframe").setAttribute("hidden", "");
    // get the attributes
    const _url = this.getAttribute("data-url");
    // check if url provided
    if (!_url) return;

    let _source = "embed"; // default
    if (this.getAttribute("data-source")) {
      _source = this.getAttribute("data-source");
    }

    switch (_source) {

      case "embed":
        this._loadEmbedVideo(_url);
        break;
     case "include":
       this._loadIncludeVideo(_url);   
    }
  }

  _calibrateWH() {
    const _video = this._shadowRoot.querySelector("iframe");

    // calibrate h and w
    const w = this.offsetWidth;
    const _aspect = this.getAttribute("data-aspect");
    let h2w = 9 / 16;
    if (_aspect) {
      const _aspectarr = _aspect.split(":");
      if (_aspectarr.length == 2) {
        const _aspectW = parseInt(_aspectarr[0]);
        const _aspectH = parseInt(_aspectarr[1]);
        if (_aspectW != 0 && _aspectH != 0) {
          h2w = _aspectH / _aspectW;
        }
      }
    }
    let h = parseInt(w * h2w);
    _video.setAttribute("width", `${w}px`);
    _video.setAttribute("height", `${h}px`);
  }

  _loadEmbedVideo(url) {
    const _loader = this._shadowRoot.querySelector(".loader");
    const _video = this._shadowRoot.querySelector("iframe");

    _loader.removeAttribute("hidden");
    _video.addEventListener("load", function (e) {
      _loader.setAttribute("hidden", "hidden");
      _video.removeAttribute("hidden");
    });

    _video.addEventListener("error", function (e) {
      _loader.setAttribute("hidden", "hidden");
    });
    _video.src = url;
  }

  _loadIncludeVideo(url) {
    const _loader = this._shadowRoot.querySelector(".loader");
    const _video = this._shadowRoot.querySelector("video");

    _loader.removeAttribute("hidden");
    _video.addEventListener("loadeddata", function (e) {
      _loader.setAttribute("hidden", "hidden");
      _video.removeAttribute("hidden");
    });

    _video.addEventListener("error", function (e) {
      _loader.setAttribute("hidden", "hidden");
    });
    _video.src = url;
  }


  stopVideo() {
    this._shadowRoot.querySelector("iframe").src = "";
    this._shadowRoot.querySelector(".video").src = "";
  }

  // attribute change
  attributeChangedCallback(name, oldVal, newVal) {
  }

  // on being removed from DOM
  disconnectedCallback() {
  }
}
// register component 
window.customElements.define("umd-component-video", UmdComponentVideo);