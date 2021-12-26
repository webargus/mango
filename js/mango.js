
(_ => {

    class MNGRoundBtn extends HTMLSpanElement {
    
        constructor() {
            const self = super();
            self.classList.add("mng-round-btn", "mng-btn-disk", "material-icons");
        }
    
        setContent(content) {
            this.textContent = content;
        }
    
        getContent() {
            return this.textContent;
        }
    }
    
    customElements.define('mng-round-btn', MNGRoundBtn, {extends: "span"});
    
    (_ => {

        const ICON_EXPAND = "expand_more";
        const ICON_RETRACT = "expand_less";

        class MNGAccordeon extends HTMLElement {
        
            constructor() {
                const self = super();
        
                self.classList.add("mng-toolbar");
                self.container = document.createElement("div");
                self.container.classList.add("mng-accordeon-container");
                const btn = document.createElement("span", {is: "mng-round-btn"});
                btn.classList.add("mng-btn-right");
                btn.textContent = "expand_more";
                btn.addEventListener("click", e => {
                    const clicked = e.target; 
                    clicked.parentElement.container.classList.toggle("mng-accordeon-expanded");
                    clicked.setContent(clicked.getContent() == ICON_EXPAND ? ICON_RETRACT : ICON_EXPAND);
                });
                self.appendChild(btn);
                self.appendChild(self.container);
        
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
                const self = super();

                self.classList.add("mng-listview");
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
























