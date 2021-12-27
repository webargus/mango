
import MNGDateUtils from "./mangodate.js"

(_ => {

    const globalStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300');
        /* material icons */
        @import url("https://fonts.googleapis.com/icon?family=Material+Icons");
    `;
    
    class MNGRoundBtn extends HTMLElement {

        icon = "add";
    
        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.icon = this.getAttribute("icon") ?? this.icon;
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
                ${globalStyles}
                .mng-round-btn {
                    color: var(--text-dark);
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
    
    class MNGAccordeon extends HTMLElement {
        
        ICON_EXPAND = "expand_more";
        ICON_RETRACT = "expand_less";

        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.caption = this.getAttribute('caption') || '';        
        }

        connectedCallback () {
            this.shadowRoot.innerHTML = `
                <style>
                ${globalStyles}

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
                    background-color: var(--text-background);
                    color: var(--text-dark);
                    display: none;
                    width: 100%;
                }

                .mng-container-expanded {
                    display: block!important;
                    border-radius: 0 0 .4em .4em;
                }
                
                .mng-toolbar {
                    background-color: var(--text-dark);
                    color: var(--text-background);
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
            div.textContent = this.caption;
            // create accordeon content fold/unfold btn and add it to wrapper
            const btn = document.createElement("mng-round-btn");
            btn.setAttribute("icon", this.ICON_EXPAND);
            btn.classList.add("mng-btn-right");
            // add click listener to unfold/fold accordeon content and toggle btn icon
            btn.addEventListener("click", e => {
                const clicked = e.target; 
                this.container.classList.toggle("mng-container-expanded");
                this.container.parentElement.classList.toggle("mng-accordeon-expanded");
                clicked.setAttribute("icon", clicked.getAttribute("icon") == this.ICON_EXPAND ? this.ICON_RETRACT : this.ICON_EXPAND);
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

    class MNGCalendar extends HTMLElement {

        btnLeft;
        btnRight;
        header;
        fontFamily = "Roboto, sans-serif";

        constructor() {
            super();
            this.attachShadow({mode: 'open'});
        }

        connectedCallback() {
            this.shadowRoot.innerHTML = `
                <style>
                ${globalStyles}

                .mng-calendar-wrapper {
                    background-color: var(--background-light, #F0F0F0);
                    border-radius: .4em;
                    border: 1px solid var(--background-dark, #C0C0C0);
                    padding: 1em;
                    min-width: 12em;
                    font-family: ${this.fontFamily};
                    display: flex;
                    flex-direction: column;
                    justify-items: center;
                }
                .mng-calendar-header {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }
                .mng-calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 1em;
                    font-size: small;
                    margin-top: 1em;
                    justify-items: center;
                }
                </style>
            `;
            const wrapper = document.createElement("div");
            wrapper.classList.add("mng-calendar-wrapper");

            const hdr = document.createElement("div");
            hdr.classList.add("mng-calendar-header");
            // arrow left
            this.btnLeft = document.createElement("mng-round-btn");
            this.btnLeft.setAttribute("icon", "chevron_left");
            this.btnLeft.addEventListener("click", _ => {
                MNGDateUtils.goPreviousMonth();
                this.header.textContent = MNGDateUtils.formatDate("MMMM, YYYY", "pt-br");
            });
            hdr.appendChild(this.btnLeft);
            // month, year
            this.header = document.createElement("div");
            this.header.textContent = MNGDateUtils.formatDate("MMMM, YYYY", "pt-br");
            hdr.appendChild(this.header);
            // arrow right
            this.btnRight = document.createElement("mng-round-btn");
            this.btnRight.setAttribute("icon", "chevron_right");
            this.btnRight.addEventListener("click", _ => {
                MNGDateUtils.goNextMonth();
                this.header.textContent = MNGDateUtils.formatDate("MMMM, YYYY", "pt-br");
            });
            hdr.appendChild(this.btnRight);
            // add header with month, year, btn left and btn right
            wrapper.appendChild(hdr);

            // // calendar grid - add week days
            // const grid = '';//this.date.weekDays.map(day => `<span>${day.substring(0, 3)}</span>`).join("");
            // const calGrid = document.createElement("div");
            // calGrid.classList.add("mng-calendar-grid");
            // // add month grid

            // calGrid.innerHTML = grid;
            
            // wrapper.appendChild(calGrid);

            this.shadowRoot.appendChild(wrapper);
        }
    }

    customElements.define("mng-calendar", MNGCalendar);
    
})();
























