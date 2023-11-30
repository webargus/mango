
import MNGDateUtils from "./mangodate.js"

(_ => {

    const globalStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300');
        /* material icons */
        @import url("https://fonts.googleapis.com/icon?family=Material+Icons");

        .mng-two-btn-header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            background-color: var(--background-light);
            border-radius: 10px;
            padding: 0 .3em;
        }

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
    `;

    class MNGGlobalBase extends HTMLElement {

        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.render();
        }

        render() {
            this.shadowRoot.innerHTML = `
            <style>
            ${globalStyles}
            </style>
            `;
        }
    }
    
    /**
     *      MNGRoundBtn
     */
    class MNGRoundBtn extends MNGGlobalBase {

        icon = "add";
    
        constructor() {
            super();
            // this.attachShadow({mode: 'open'});
            this.icon = this.getAttribute("icon") ?? this.icon;
            super.render();
            this.render();
        }

        static get observedAttributes() { return ['icon']; }

        attributeChangedCallback(name, oldValue, newValue) {
            if(name == 'icon') {
                setTimeout(_ => {
                    super.shadowRoot.querySelector("span").textContent = newValue;
                });
            }
        }

        render() {
            const span = document.createElement("span");
            span.classList.add("mng-round-btn", "mng-btn-disk", "material-icons");
            span.textContent = this.icon;
            super.shadowRoot.appendChild(span);
        }
    
    }
    
    customElements.define('mng-round-btn', MNGRoundBtn);
    
    /**
     *      MNGAccordeon
     */
    class MNGAccordeon extends HTMLElement {
        
        ICON_EXPAND = "expand_more";
        ICON_RETRACT = "expand_less";
        container;
        caption;
        captionDiv;
        toolbar;
        onOpen = new Event("open");
        onClose = new Event("close");

        constructor() {
            super();
            // can't render in connectedCallback: this.container member must be created and made available to
            // inherited classes right after calling this constructor via super
            this.attachShadow({mode: 'open'});
            this.render();
        }

        getStyle() {
            const style = document.createElement("style");
            style.textContent = `
            ${globalStyles}

            .mng-accordeon-wrapper {
                border: 1px solid var(--background-dark);
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

            .mng-accordeon-container {
                background-color: var(--text-background);
                color: var(--text-dark);
                display: none;
                width: 100%;
            }

            .mng-accordeon-container:last-child {
                overflow: hidden!important; /* hides sharp edges of content behind element's round corner */
            }

            .mng-container-expanded {
                display: block!important;
                border-radius: 0 0 .4em .4em;
                border-top: 1px solid var(--background-dark);
            }
            
            .mng-toolbar {
                background-color: var(--background-light);
                color: var(--text-dark);
                min-width: 10em;
                width: 100%;
                box-sizing: border-box;
                padding: .4em;
                border-radius: .4em .4em 0 0;
                text-overflow: ellipsis;
                overflow: hidden;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            `;
            return style;
        }

        render() {
            this.caption = this.getAttribute('caption') || '';
            this.shadowRoot.append(this.getStyle());
            // create wrapping div
            var wrapper = document.createElement("div");
            wrapper.classList.add("mng-accordeon-wrapper");

            // create toolbar
            this.toolbar = document.createElement("div");
            this.toolbar.classList.add("mng-toolbar");

            // add caption div to toolbar
            this.captionDiv = document.createElement("div");
            this.captionDiv.textContent = this.caption;
            this.toolbar.appendChild(this.captionDiv);

            // create accordeon content fold/unfold btn and add it to toolbar
            const btn = document.createElement("mng-round-btn");
            btn.setAttribute("icon", this.ICON_EXPAND);
            // add click listener to unfold/fold accordeon content and toggle btn icon
            btn.addEventListener("click", e => {
                e.stopPropagation();      // important
                const clicked = e.target; 
                this.container.classList.toggle("mng-container-expanded");
                this.container.parentElement.classList.toggle("mng-accordeon-expanded");
                if(clicked.getAttribute("icon") == this.ICON_EXPAND) {
                    // is retracted => will open
                    clicked.setAttribute("icon", this.ICON_RETRACT);
                    // dispatch onOpen event
                    this.dispatchEvent(this.onOpen);
                } else {
                    // is open => will retract
                    clicked.setAttribute("icon", this.ICON_EXPAND);
                    // dispatch onClose event
                    this.dispatchEvent(this.onClose);
                }
            });
            this.toolbar.appendChild(btn);
            this.toolbar.addEventListener("click", e => { btn.click(); });   // delegate clicks on toolbar to toolbar btn

            // append toolbar to custom element wrapper
            wrapper.appendChild(this.toolbar);

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

        getContainer() {
            return this.container;
        }

        setCaption(caption) {
            this.caption = caption;
            this.captionDiv.textContent = this.caption;
        }

        retract() {
            this.toolbar.click();
        }
    }
    
    customElements.define("mng-accordeon", MNGAccordeon);

    /**
     *  MNGListView
     */
    class MNGListView extends HTMLElement {

        listview;

        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.addItem = this.addItem.bind(this);
            this.render();
        }
        
        render() {
            const style = document.createElement("style");
            style.textContent = `
            .mng-listview {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .mng-listview li:not(:last-child) {
                border-bottom: 1px solid var(--background-dark);
            }
            `;
            this.shadowRoot.append(style);
            this.listview = document.createElement("ul");
            this.listview.classList.add("mng-listview");
            this.shadowRoot.appendChild(this.listview);
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
            this.listview.appendChild(li);
        }
    }

    customElements.define("mng-listview", MNGListView);

    /**
     *  MNGCalendar
     */
    class MNGCalendar extends HTMLElement {

        dateUtils = new MNGDateUtils();
        btnLeft;
        btnRight;
        header;
        fontFamily;
        calGrid;
        callback = null;

        /**
         *  See 'this in classes' section at 
         *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
         * 
         *  binding methods to 'this' avoids fatal 'undefined' errors when calling those methods
         */
        constructor(callback = null) {
            super();
            this.callback = callback;
            this.fontFamily = "Roboto, sans-serif";
            this.goNextMonth = this.goNextMonth.bind(this);         // crashes unless we bind these methods to 'this'
            this.goPreviousMonth = this.goPreviousMonth.bind(this);
            this.dateCallback = this.dateCallback.bind(this);
            this.attachShadow({mode: 'open'});
        }
        
        connectedCallback() {
            this.render();
        }

        render() {
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
                .mng-weekdays-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 1em;
                    font-size: small;
                    margin-top: 1em;
                    justify-items: center;
                    background-color: var(--text-background);
                    padding: .5em;
                    border-radius: .4em .4em 0 0;
                }
                .mng-calendar-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: 1em;
                    font-size: small;
                    justify-items: center;
                    background-color: var(--text-background);
                    padding: .5em;
                    border-radius: 0 0 .4em .4em;
                    cursor: pointer;
                }
                .mng-calendar-grid span {
                    border-radius: 50%;
                    width: .8em;
                    height: .8em;
                    display: flex;
                    align-content: center;
                    justify-content: center;
                    align-items: center;
                    padding: .8em;
                }
                .mng-calendar-grid span:hover {
                    color: var(--text-background);
                    background-color: var(--background-dark);
                }
                .mng-calendar-light-day {
                    color: var(--background-dark);
                }
                .mng-calendar-today {
                    color: var(--tex-background);
                    background-color: var(--background-light);
                }
                </style>
            `;
            const wrapper = document.createElement("div");
            wrapper.classList.add("mng-calendar-wrapper");

            const hdr = document.createElement("div");
            hdr.classList.add("mng-two-btn-header");
            // arrow left
            this.btnLeft = document.createElement("mng-round-btn");
            this.btnLeft.setAttribute("icon", "chevron_left");
            this.btnLeft.addEventListener("click", this.goPreviousMonth);
            hdr.appendChild(this.btnLeft);
            // month, year
            this.header = document.createElement("div");
            this.header.textContent = this.dateUtils.formatDate("MMMM de YYYY", "pt-br");
            hdr.appendChild(this.header);
            // arrow right
            this.btnRight = document.createElement("mng-round-btn");
            this.btnRight.setAttribute("icon", "chevron_right");
            this.btnRight.addEventListener("click", this.goNextMonth);
            hdr.appendChild(this.btnRight);
            // add header with month, year, btn left and btn right
            wrapper.appendChild(hdr);
            // add week days
            const weekNames = document.createElement("div");
            weekNames.classList.add("mng-weekdays-grid");
            var row = "";
            this.dateUtils.getLocaleWeekDayNames("pt-br", 3).forEach(wday => {
                row += `<span>${wday.substring(0, 3)}</span>`;
            });
            weekNames.innerHTML = row;
            wrapper.appendChild(weekNames);

            this.calGrid = document.createElement("div");
            this.calGrid.classList.add("mng-calendar-grid");
            wrapper.appendChild(this.calGrid);
            this.renderCalendar();

            this.shadowRoot.appendChild(wrapper);
        }

        renderCalendar() {
            // clear prev calendar (if any)
            this.calGrid.innerHTML = '';
            // add calendar grid
            const calendar = this.dateUtils.getCalendarObject();
            calendar.matrix.forEach((day, ix) => {
                var span = document.createElement("span");
                if(ix == calendar.todayPos && this.dateUtils.isToday(new Date())) {
                    span.classList.add("mng-calendar-today");
                }
                span.textContent = day;
                if(ix < calendar.firstWeekDay) {
                    span.addEventListener("click", e => {
                        const dt = this.dateUtils.goPreviousMonth(this.dateUtils.getDateObject());
                        this.dateCallback(e, dt);
                    });
                    span.classList.add("mng-calendar-light-day");
                } else if (ix >= calendar.firstWeekDay + calendar.numDays) {
                    span.addEventListener("click", e => {
                        const dt = this.dateUtils.goNextMonth(this.dateUtils.getDateObject());
                        this.dateCallback(e, dt);
                    });
                    span.classList.add("mng-calendar-light-day");
                } else {
                    span.addEventListener("click", this.dateCallback);
                }
                this.calGrid.appendChild(span);
            });
        }

        dateCallback(e, dt = null) {
            dt = dt ?? this.dateUtils.getDateObject();
            let day = parseInt(e.target.textContent);
            dt = new Date(dt.getFullYear(), dt.getMonth(), day);
            if(this.callback != null) {
                this.callback(dt);
            }
        }

        goNextMonth() {
            this.dateUtils.goNextMonth();
            this.header.textContent = this.dateUtils.formatDate("MMMM de YYYY", "pt-br");
            this.renderCalendar();
        }

        goPreviousMonth() {
            this.dateUtils.goPreviousMonth();
            this.header.textContent = this.dateUtils.formatDate("MMMM de YYYY", "pt-br");
            this.renderCalendar();
        }
        
    }

    customElements.define("mng-calendar", MNGCalendar);
    
    /**
     *      MNGSelect
     */
    class MNGSelect extends MNGAccordeon {

        listview;
        value;

        constructor() {
            super();
            this.handleOptionMouseOver = this.handleOptionMouseOver.bind(this);
            this.handleOptionSelect = this.handleOptionSelect.bind(this);
        }

        connectedCallback() {
            // add listview to accordeon container
            this.listview = document.createElement("mng-listview");
            const style = document.createElement("style");
            style.textContent = `
                .mng-select-option {
                    color: var(--text-dark);
                    background-color: var(--text-background);
                }
                .mng-option-selected {
                    color: var(--text-background);
                    background-color: var(--background-dark);
                }
            `;
            this.listview.shadowRoot.appendChild(style);
            super.getContainer().appendChild(this.listview);
            // initialize widget value
            this.value = null;
            var tempValue, tempOption;
            [...this.children].forEach((option, ix) => {
                if(ix == 0) {
                    // temporarily save value of top-most option in case no select attr assigned
                    tempValue = option.getAttribute("value");
                    tempOption = option.textContent;
                    if(tempValue == undefined) {
                        tempValue = tempOption;
                    }
                }
                if(option.getAttribute("selected")) {
                    this.value = option.getAttribute("value");
                    if(this.value == undefined) {
                        this.value = option.textContent;
                    }
                    super.setCaption(option.textContent);
                }
                option.classList.add("mng-select-option");
                // transfer items from 'this' to internal listview
                this.listview.addItem(option);

                option.addEventListener("mouseover", this.handleOptionMouseOver);
                option.addEventListener("click", this.handleOptionSelect);
            });
            if(this.value == null) {
                this.value = tempValue;
                super.setCaption(tempOption);
            }

            // listen to accordeon custom 'open' event
            this.addEventListener("open", this.handleDeploySelectContainer);
        }

        handleOptionSelect(e) {
            let option = e.target;
            this.value = option.getAttribute("value");
            if(this.value == undefined) {
                this.value = option.textContent;
            }
            super.setCaption(option.textContent);
            super.retract();
            console.log("value:", this.value);
        }

        handleOptionMouseOver(e) {
            this.listview.shadowRoot.querySelectorAll(".mng-select-option").forEach(option => {
                option.classList.remove("mng-option-selected");
            });
            e.target.classList.add("mng-option-selected");
        }

        handleDeploySelectContainer(e) {
            this.listview.shadowRoot.querySelectorAll(".mng-select-option").forEach(option => {
                option.getAttribute("value") == this.value || option.innerText == this.value ?
                option.classList.add("mng-option-selected") : option.classList.remove("mng-option-selected");
            });
        }

    }

    customElements.define("mng-select", MNGSelect);

    /*
    *   MNGModalOk
    */
    class MNGModalOk extends HTMLElement {

        closeBtn;

        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.render();
        }

        static get observedAttributes() { return ['header']; }

        attributeChangedCallback(name, oldValue, newValue) {
            if(name == 'header') {
                setTimeout(_ => {
                    this.shadowRoot.querySelector("h3").textContent = newValue;
                });
            }
        }

        getStyle() {
            const style = document.createElement("style");
            style.textContent = `
                ${globalStyles}

                .modal {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 240px;
                    padding: .3em;
                    border-radius: 10px;
                    background: white;
                    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    /*  set modal height 4em smaller than view height
                    when view height smaller than default modal height;
                    make modal scrollable when it happens */
                    overflow: auto;
                    pointer-events: auto;
                    max-height: calc(100vh - 4em);
                }

                @keyframes modal-pop {
                    0% { 
                        opacity: 0;
                    }
                    /* center modal on page */
                    100% {
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        opacity: 1;
                    }
                }

                .modal-open {
                    display: block!important;
                }
                .modal-open .modal {
                    animation: modal-pop .3s cubic-bezier(0,.6,1,1) forwards;
                }
                .modal-shroud {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10;
                    background: rgba(0,0,0, 0.4);
                    display: none;
                }

                .modal .cancel-button, .ok-button {
                    width: 6em;
                    background: #193b99;
                    color: white;
                    border: 0;
                    padding: .8em;
                    border-radius: 1em;
                    cursor: pointer;
                }
            `;
            return style
        }

        connectedCallback() {
            this.setAttribute("header", "Modal OK");
        }

        render() {
            this.shadowRoot.append(this.getStyle());
            // add background shroud to darken screen and wrapp modal popup
            const shroud = document.createElement("div");
            shroud.classList.add("modal-shroud");
            this.shadowRoot.appendChild(shroud);
            // create modal popup and insert it into shroud
            const popup = document.createElement("div");
            popup.classList.add("modal");
            shroud.appendChild(popup);
            // create header 
            const hdr = document.createElement("div");
            hdr.classList.add("mng-two-btn-header");
            // icon left
            const iconSpan = document.createElement("span");
            iconSpan.classList.add("mng-round-btn", "mng-btn-disk", "material-icons");
            iconSpan.textContent = "person";
            hdr.appendChild(iconSpan);
            // header caption
            const headerCaption = document.createElement("h3");
            headerCaption.textContent = "HEADER";
            hdr.appendChild(headerCaption);
            // close button
            this.closeBtn = new MNGRoundBtn();
            this.closeBtn.setAttribute("icon", "close");
            hdr.appendChild(this.closeBtn);
            // append header to popup
            popup.appendChild(hdr);
        }

    }

    customElements.define("mng-modalok", MNGModalOk);
})();
























