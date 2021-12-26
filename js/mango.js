
(_ => {

    class MNGRoundBtn extends HTMLElement {
    
        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.icon = this.getAttribute("icon");
        }

        static get observedAttributes() { return ['icon']; }

        attributeChangedCallback(name, oldValue, newValue) {
            if(name == 'icon') {
                setTimeout(_ => {
                    this.shadowRoot.querySelector("span").textContent = newValue;
                });
            }
        }

        connectedCallback () {
            this.shadowRoot.innerHTML = `
                <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&family=Work+Sans:wght@400;600&display=swap');
                /* material icons */
                @import url("https://fonts.googleapis.com/icon?family=Material+Icons");

                .mng-round-btn {
                    color: var(--front-dark);
                    opacity: .8;
                    cursor: pointer;
                }
                .mng-round-btn:hover {
                    opacity: 1;
                }
                .mng-btn-disk {
                    background-color: var(--background-dark);
                    border-radius: 50%;
}

                </style>
                <span class="mng-round-btn mng-btn-disk material-icons">${this.icon}</span>
            `;
        }
    
    }
    
    customElements.define('mng-round-btn', MNGRoundBtn);
    
    (_ => {

        const ICON_EXPAND = "expand_more";
        const ICON_RETRACT = "expand_less";

        class MNGAccordeon extends HTMLElement {

            constructor() {
                super();
                this.attachShadow({mode: 'open'});
                this.title = this.getAttribute('title');        
            }

            connectedCallback () {
                this.shadowRoot.innerHTML = `
                    <style>
                    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&family=Work+Sans:wght@400;600&display=swap');

                    @import url("https://fonts.googleapis.com/icon?family=Material+Icons");

                    .mng-accordeon-wrapper {
                        border: 1px solid var(--front-dark);
                        border-radius: .4em .4em 0 0;
                        font-family: Roboto, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        width: 100%;
                    }

                    .mng-accordeon-expanded {
                        border-radius: .4em;
                    }

                    .mng-btn-right {
                        position: absolute;
                        right: .25em;
                        top: .25em;
                    }
                    
                    .mng-accordeon-container {
                        background-color: var(--background-light);
                        color: var(--front-dark);
                        display: none;
                        width: 100%;
                    }

                    .mng-container-expanded {
                        display: block!important;
                        border-radius: 0 0 .4em .4em;
                    }
                    
                    .mng-toolbar {
                        background-color: var(--front-dark);
                        color: var(--background-light);
                        position: relative;
                        min-width: 10em;
                        width: 100%;
                        padding: .4em 0;
                        display: inline-block;
                        border-radius: .4em .4em 0 0;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        text-align: center;
                    }
                    
                    </style>
                `;
                // create wrapping div
                var wrapper = document.createElement("div");
                wrapper.classList.add("mng-accordeon-wrapper");

                // create toolbar
                var div = document.createElement("div");
                div.classList.add("mng-toolbar");
                div.textContent = this.title;
                // create accordeon content fold/unfold btn and add it to wrapper
                const btn = document.createElement("mng-round-btn");
                btn.setAttribute("icon", ICON_EXPAND);
                btn.classList.add("mng-btn-right");
                // add click listener to unfold/fold accordeon content and toggle btn icon
                btn.addEventListener("click", e => {
                    const clicked = e.target; 
                    this.container.classList.toggle("mng-container-expanded");
                    this.container.parentElement.classList.toggle("mng-accordeon-expanded");
                    clicked.setAttribute("icon", clicked.getAttribute("icon") == ICON_EXPAND ? ICON_RETRACT : ICON_EXPAND);
                });

                div.appendChild(btn);
                // append toolbar to custom element wrapper
                wrapper.appendChild(div);

                // create accordeon container div and append it to wrapper
                this.container = document.createElement("div");
                this.container.classList.add("mng-accordeon-container");
                wrapper.appendChild(this.container);

                // append wrapper to custom element
                this.shadowRoot.appendChild(wrapper);
            }

            addItem(item) {
                this.container.appendChild(item);
            }
        }
        
        customElements.define("mng-accordeon", MNGAccordeon);

    })();

    (_ => {

        class MNGListView extends HTMLUListElement {

            constructor() {
                super();
            }

            connectedCallback() {
                const style = document.createElement("style");
                style.textContent = `
                .mng-listview {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .mng-listview li:not(:first-child) {
                    border-top: 1px solid var(--background-dark);
                }
                `;
                this.append(style);
                this.classList.add("mng-listview");
            }

            addItem(item) {
                const li = document.createElement("li");
                switch(typeof item) {
                    case "object":
                        li.appendChild(item);
                        break;
                    case "string":
                        li.textContent = item;
                        break;

                }
                this.appendChild(li);
            }
        }

        customElements.define("mng-listview", MNGListView, {extends: "ul"});

    })();
    
})();
























