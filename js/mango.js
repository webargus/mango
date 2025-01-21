
import MNGDateUtils from "./mangodate.js"

(_ => {

    class MNGStyleSheet {
        
        static sheet = new CSSStyleSheet();

        static globalStyles = `
           /*
            see https://developers.google.com/fonts/docs/material_symbols#self-hosting_the_font
            */

            .material-symbols-outlined {
                font-family: 'Material Symbols Outlined';
                font-weight: normal;
                font-style: normal;
                font-size: 24px;  /* Preferred icon size */
                display: inline-block;
                line-height: 1;
                text-transform: none;
                letter-spacing: normal;
                word-wrap: normal;
                white-space: nowrap;
                direction: ltr;
            }

            .mng-two-btn-header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                gap: 1em;
                background-color: var(--background-light);
                border-radius: 10px;
                padding: 0 .3em;
                max-height: 2.6em;
            }
        `;
        
        /*
            Create a single object from this class as a static member of the class
            that is going to use it (MNGGlobalBase)
        */
        constructor() {
            MNGStyleSheet.sheet.replaceSync(MNGStyleSheet.globalStyles);
        }

        getSheet() {
            return MNGStyleSheet.sheet;
        }
   }

    class MNGGlobalBase extends HTMLElement {
        
        // create a static instance of the MNGStyleSheet class to avoid creating multiple MNGStyleSheet
        // objects as the classes inheriting from MNGGlobalBase call this constructor
        static sheet = new MNGStyleSheet();

        constructor() {
            super();
            try {
                this.attachShadow({mode: 'open'}).adoptedStyleSheets = [MNGGlobalBase.sheet.getSheet()];
            } catch(exception) {
                console.log(exception);
            }
        }
    }
    
    /**
     *      MNGRoundBtn
     */
    class MNGRoundBtn extends MNGGlobalBase {

        icon = "add";
    
        constructor() {
            super();
            this.icon = this.getAttribute("icon") ?? this.icon;
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
            const style = document.createElement("style");
            style.textContent = `
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
            super.shadowRoot.append(style);

            const span = document.createElement("span");
            span.classList.add("mng-round-btn", "mng-btn-disk", "material-symbols-outlined");
            span.textContent = this.icon;
            super.shadowRoot.appendChild(span);
        }
    
    }
    
    customElements.define('mng-round-btn', MNGRoundBtn);

    /**
     *  MNGButton
     */
    class MNGButton extends MNGGlobalBase {

        caption = "";

        constructor() {
            super();
            this.caption = this.getAttribute("caption") ?? this.caption;
            this.render();
        }

        static get observedAttributes() { return ['caption']; }

        attributeChangedCallback(name, oldValue, newValue) {
            if(name == 'caption') {
                setTimeout(_ => {
                    super.shadowRoot.querySelector("button").textContent = newValue;
                });
            }
        }

        render() {
            const style = document.createElement("style");

            style.textContent = `
                .mng-button {
                    min-width: 6em;
                    background: var(--background-dark);
                    color: var(--front-dark);
                    font-size: 1em;
                    opacity: .8;
                    border: 0;
                    padding: .5em;
                    border-radius: .5em;
                    cursor: pointer;
                    margin: .5em;
                }

                .mng-button:hover {
                    opacity: 1!important;
                }
            `;
            super.shadowRoot.appendChild(style);

            const button = document.createElement("button");
            button.classList.add("mng-button");
            button.textContent = this.caption;
            super.shadowRoot.appendChild(button);
        }
    }
    
    customElements.define("mng-button", MNGButton);
    
    /**
     *      MNGAccordeon
     */
    class MNGAccordeon extends MNGGlobalBase {
        
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
            this.render();
        }

        getStyle() {
            const style = document.createElement("style");
            style.textContent = `
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
            super.shadowRoot.append(this.getStyle());
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
            super.shadowRoot.appendChild(wrapper);
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
    class MNGCalendar extends MNGGlobalBase {

        dateUtils;
        btnLeft;
        btnRight;
        header;
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
            this.goNextMonth = this.goNextMonth.bind(this);         // crashes unless we bind these methods to 'this'
            this.goPreviousMonth = this.goPreviousMonth.bind(this);
            this.dateCallback = this.dateCallback.bind(this);
        }
        
        connectedCallback() {
            this.render();
        }

        render() {
            this.dateUtils = new MNGDateUtils();
            const style = document.createElement("style");
            style.textContent = `

                .mng-calendar-wrapper {
                    background-color: var(--background-light, #F0F0F0);
                    border-radius: .4em;
                    border: 1px solid var(--background-dark, #C0C0C0);
                    padding: 1em;
                    min-width: 12em;
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
            `;
            
            super.shadowRoot.append(style); 
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
                row += `<span>${wday}</span>`;
            });
            weekNames.innerHTML = row;
            wrapper.appendChild(weekNames);

            this.calGrid = document.createElement("div");
            this.calGrid.classList.add("mng-calendar-grid");
            wrapper.appendChild(this.calGrid);
            this.renderCalendar();

            super.shadowRoot.appendChild(wrapper);
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

    class MNGWeekCalendarEvents {

        static selections = [];
        static firstClick = false;
        static clickedElement;

        static handleHourClick(e) {
            // console.log(e.target);
            e.preventDefault();
            const t = e.target;
            const status = t.dataset.status ?? "available";
            switch(status) {
                case "available":
                    if(MNGWeekCalendarEvents.firstClick) {
                        // user has clicked on an available cell before
                        if(MNGWeekCalendarEvents.validateSecondClick(t)) {
                            // valid second click -> update dangling selection object
                            // obj list structure
                            // [{ws: 2, hrs: 10, mins: 00}, {ws: 3, hrs: 20, mins: 30}, ...]
                            MNGWeekCalendarEvents.selections.push(
                                MNGWeekCalendarEvents.getCellObjs(MNGWeekCalendarEvents.clickedElement, t)
                            );
                            // update object html params
                            t.classList.add("mng-weekcalendar-selected");
                            t.dataset.status = "taken";
                            // put first click flag down to enable fresh selections
                            MNGWeekCalendarEvents.firstClick = false;
                            console.log(MNGWeekCalendarEvents.selections);
                        }
                    } else {
                        // that's a first click on an available cell
                        MNGWeekCalendarEvents.firstClick = true;
                        // set dangling selection initial object to this one
                        MNGWeekCalendarEvents.clickedElement = t;
                        // update cell selection on GUI
                        t.classList.add("mng-weekcalendar-selected");
                        t.dataset.status = "taken";
                    }
                    break;
                case "taken":
                    // user made a second click on a cell already taken
                    MNGWeekCalendarEvents.resetSelection();
                    break;
            }
        }

        static validateSecondClick(t) {
            const firstObj = MNGWeekCalendarEvents.getClickedObj(MNGWeekCalendarEvents.clickedElement);
            const secondObj = MNGWeekCalendarEvents.getClickedObj(t);
            if(firstObj.wday != secondObj.wday) {
                // user clicked on a different day column -> reset selection
                MNGWeekCalendarEvents.resetSelection();
                return false;
            } else {
                // user clicked on the hour cell initially selected -> reset selection
                if(firstObj.hour == secondObj.hour && firstObj.min == secondObj.min) {
                    MNGWeekCalendarEvents.resetSelection();
                    return false;
                }
            }
            // check if there is any cell previously selected between cell selected first
            // and this last one inclusevely
            const sel = MNGWeekCalendarEvents.getCellObjs(MNGWeekCalendarEvents.clickedElement, t);
            sel.forEach((s0, ix) => {
                if(ix != 0) {   // skip first selection, which was already taken
                    MNGWeekCalendarEvents.selections.forEach(s1 => {
                        if(s0.wd == s1.wd && s0.hrs == s1.hrs && s0.mins == s1.mins) {
                            return false;
                        }
                    });
                }
            });
            return true;
        }

        static getClickedObj(t) {
            return {wday: t.dataset.wd,
                    hour: t.dataset.hrs,
                    min:  t.dataset.mins};
        }

        static resetSelection() {
            let obj = MNGWeekCalendarEvents.clickedElement
            if(obj) {
                if(obj.init) {
                    obj.init.classList.remove("mng-weekcalendar-selected");
                    obj.init.setAttribute("status", "available");
                }
                if(obj.end) {
                    obj.end.classList.remove("mng-weekcalendar-selected");
                    obj.end.setAttribute("status", "available");
                }
                MNGWeekCalendarEvents.firstClick = false;
                MNGWeekCalendarEvents.clickedElement = {};
            }
        }

        static getCellObjs(t1, t2) {
            var wd = t1.dataset.wd;
            if(t2.dataset.wd != wd) { return []; }
            wd = parseInt(wd);
            var hrs1 = parseInt(t1.dataset.hrs) + parseInt(t1.dataset.mins)/60;
            var hrs2 = parseInt(t2.dataset.hrs) + parseInt(t2.dataset.mins)/60;
            // swap hours if init hour greater than end one
            [hrs1, hrs2] = hrs1 > hrs2 ? [hrs2, hrs1] : [hrs1, hrs2];
            return [...t1.parentElement.children].filter( div => {
                let hrs = parseInt(div.dataset.hrs) + parseInt(div.dataset.mins)/60;
                return (wd == parseInt(div.dataset.wd)) && (hrs >= hrs1) && (hrs <= hrs2);
            }).map(div => {
                return {wd: div.dataset.wd, hrs: div.dataset.hrs, mins: div.dataset.mins};
            });
        }
    }
    
    /**
     *  MNGWeekCalendar
     */
    class MNGWeekCalendar extends MNGGlobalBase {

        dateUtils;
        btnLeft;
        btnRight;
        header;
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
            this.goNextWeek = this.goNextWeek.bind(this);         // crashes unless we bind these methods to 'this'
            this.goPreviousWeek = this.goPreviousWeek.bind(this);
        }
        
        connectedCallback() {
            this.render();
        }

        render() {
            this.dateUtils = new MNGDateUtils();
            const style = document.createElement("style");
            style.textContent = `

                .mng-weekcalendar-wrapper {
                    background-color: var(--background-light, #F0F0F0);
                    border-radius: .4em;
                    border: 1px solid var(--background-dark, #C0C0C0);
                    padding: 1em;
                    min-width: 12em;
                    display: flex;
                    flex-direction: column;
                    justify-items: center;
                }
                .mng-weekcalendardays-grid {
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    font-size: small;
                    margin-top: 1em;
                    background-color: var(--text-background);
                    padding: .5em;
                    border-radius: .4em .4em 0 0;
                }
                .mng-weekcalendardays-grid > div {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border: transparent;
                    border-left: 1px solid var(--text-dark);
                    border-top: 1px solid var(--text-dark);
                    padding: .5em;
                }
                .mng-weekcalendardays-grid > div:nth-child(n+8) {
                    cursor: pointer;
                    font-size: .7em;
                }
                .mng-weekcalendar-border-right {
                    border-right: 1px solid var(--text-dark)!important;
                }
                .mng-weekcalendar-border-bottom {
                    border-bottom: 1px solid var(--text-dark)!important;
                }
                .mng-weekcalendar-selected {
                    background-color: orange;
                }
            `;
            
            super.shadowRoot.append(style); 
            const wrapper = document.createElement("div");
            wrapper.classList.add("mng-weekcalendar-wrapper");

            const hdr = document.createElement("div");
            hdr.classList.add("mng-two-btn-header");
            // arrow left
            this.btnLeft = document.createElement("mng-round-btn");
            this.btnLeft.setAttribute("icon", "chevron_left");
            this.btnLeft.addEventListener("click", this.goPreviousWeek);
            hdr.appendChild(this.btnLeft);
            // month, year
            this.header = document.createElement("div");
            hdr.appendChild(this.header);
            // arrow right
            this.btnRight = document.createElement("mng-round-btn");
            this.btnRight.setAttribute("icon", "chevron_right");
            this.btnRight.addEventListener("click", this.goNextWeek);
            hdr.appendChild(this.btnRight);
            // add header with month, year, btn left and btn right
            wrapper.appendChild(hdr);

            this.calGrid = document.createElement("div");
            wrapper.appendChild(this.calGrid);
            this.renderWeekCalendar();

            super.shadowRoot.appendChild(wrapper);
        }

        renderWeekCalendar() {
            // clear prev calendar (if any)
            this.calGrid.innerHTML = '';
            // add week days
            const weekNames = document.createElement("div");
            weekNames.classList.add("mng-weekcalendardays-grid");
            const weeks = this.dateUtils.getWeekObj();
            this.composeWeekCalendarHeaderText(weeks);
            weeks.forEach((date, ix, arr) => {
                let div = document.createElement("div");
                let div0 = document.createElement("div");
                div0.innerText =`${this.dateUtils.formatDate("DD", "pt-br", date)}`;
                div.appendChild(div0);
                div0 = document.createElement("div");
                div0.innerText = `${date.toLocaleString("pt-br", {month: "long"}).substring(0,3)}`;
                div.appendChild(div0);
                if(ix == arr.length - 1) { div.classList.add("mng-weekcalendar-border-right"); }
                weekNames.appendChild(div);
            });
            // render hours grid
            const initHour = parseInt(this.dataset.initHour);
            const endHour = parseInt(this.dataset.endHour);
            const timeStep = parseInt(this.dataset.timeStep); // 1-> :30h; 0 -> ::00h
            for(let hrs = initHour; hrs <= endHour; hrs++) {
                for(let stp = 0; stp <= timeStep; stp++) {
                    let mins = 3*stp + "0";
                    for(let wd = 0; wd < 7; wd++) {
                        var whr = document.createElement("div");
                        whr.dataset.wd = wd;
                        whr.dataset.hrs = hrs;
                        whr.dataset.mins = mins;
                        if(wd == 6) { whr.classList.add("mng-weekcalendar-border-right"); }
                        if(hrs + stp == endHour + timeStep) {
                            whr.classList.add("mng-weekcalendar-border-bottom");
                        }
                        whr.innerText = `${hrs}:${mins}h`;
                        whr.addEventListener("click", MNGWeekCalendarEvents.handleHourClick);
                        weekNames.appendChild(whr);
                    }
                }
            }
            this.calGrid.appendChild(weekNames);
        }

        formatWeekCalendarHeaderText(date) {
            var monthName = date.toLocaleString("pt-br", {month: "short"}).substring(0,3);
            monthName = `<span style="text-transform: capitalize;">${monthName}</span>`;
            return this.dateUtils.formatDate("DD/MM/YYYY", "pt-br", date);
        }

        composeWeekCalendarHeaderText(week) {
            var headerText = "De ";
            headerText += this.formatWeekCalendarHeaderText(week[0]);
            headerText += " a ";
            headerText += this.formatWeekCalendarHeaderText(week[6]);
            this.header.innerHTML = headerText;
        }

        goNextWeek() {
            this.composeWeekCalendarHeaderText(this.dateUtils.goNextWeek());
            this.renderWeekCalendar();
        }

        goPreviousWeek() {
            this.composeWeekCalendarHeaderText(this.dateUtils.goPrevWeek());
            this.renderWeekCalendar();
        }        
    }

    customElements.define("mng-weekcalendar", MNGWeekCalendar);

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
    *   MNGModalBase
    */
    class MNGModalBase extends MNGGlobalBase {

        contentSlot;
        shroud;
        popup;
        okBtn;
        static modals = 0;

        constructor() {
            super();
            this.cancelModal = this.cancelModal.bind(this);
            this.openModal = this.openModal.bind(this);
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
                    /* overflow: auto; */ /* blurrs/focus header when close btn mouseover */
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

                .mng-two-btn-header h3 {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-wrap: nowrap;
                    white-space: nowrap;
                    padding: 0 .25em;
                }

                .row-flex {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                }

                .row-flex.content > :first-child {
                    font-size: 5em;
                    color: darkorange;
                }
                
                .row-flex.content > :last-child {
                    text-align: left;
                    padding: .5em;
                }
            `;
            return style;
        }

        setHeader(header) {
            this.setAttribute("header", header);
        }

        render() {
            this.shadowRoot.append(this.getStyle());
            // add background shroud to darken screen and wrapp modal popup
            this.shroud = document.createElement("div");
            this.shroud.classList.add("modal-shroud");
            this.shadowRoot.appendChild(this.shroud);
            // create modal popup and insert it into shroud
            this.popup = document.createElement("div");
            this.popup.classList.add("modal");
            this.shroud.appendChild(this.popup);
            // create header 
            const hdr = document.createElement("div");
            hdr.classList.add("mng-two-btn-header");
            // icon left
            const iconSpan = document.createElement("span");
            iconSpan.classList.add("mng-round-btn", "mng-btn-disk", "material-symbols-outlined");
            iconSpan.textContent = "person";
            hdr.appendChild(iconSpan);
            // header caption
            const headerCaption = document.createElement("h3");
            headerCaption.textContent = this.getAttribute("header") || "HEADER";
            hdr.appendChild(headerCaption);
            // close button
            const button = new MNGRoundBtn();
            button.setAttribute("icon", "close");
            button.addEventListener("click", this.cancelModal);
            hdr.appendChild(button);
            // append header to popup
            this.popup.appendChild(hdr);
            // create content slot
            this.contentSlot = document.createElement("div");
            this.popup.appendChild(this.contentSlot);
            // just create ok button but don't append it yet, leave it up to inherited classes to do it
            this.okBtn = new MNGButton();
            this.okBtn.setAttribute("caption", "OK");
        }

        setContent(content) {
            // clear content slot
            this.contentSlot.innerHTML = "";
            // 
            switch(typeof content) {
                case "object":
                    this.contentSlot.appendChild(content);
                    break;
                case "string":
                    this.contentSlot.classList.add("row-flex", "content");
                    var block = document.createElement("span");
                    block.classList.add("mng-round-btn", "mng-btn-disk", "material-symbols-outlined");
                    block.textContent = "warning";
                    this.contentSlot.appendChild(block);
                    block = document.createElement("span");
                    block.textContent = content;
                    this.contentSlot.appendChild(block);
                    break;

            }
        }

        openModal() {
            if(this.shroud.classList.contains("modal-open")) {
                // modal already open, just return
                return;
            }
            MNGModalBase.modals++;
            this.shroud.classList.add("modal-open");
            // lock page scrolling
            document.body.classList.add("freeze");        
        }

        cancelModal() {
            if(this.shroud.classList.contains("modal-open")) {
                this.shroud.classList.remove("modal-open");
                MNGModalBase.modals--;
                if(MNGModalBase.modals == 0) {
                    // no more modals left open, unlock page scrolling
                    document.body.classList.remove("freeze");
                }
            }
        }
    }

    /**
     *  MNGModalOk
     */
    class MNGModalOk extends MNGModalBase {

        constructor() {
            super();
            super.render();
            this.render();
        }

        render() {
            this.okBtn.addEventListener("click", this.cancelModal);
            this.popup.appendChild(this.okBtn);
        }
    }

    customElements.define("mng-modalok", MNGModalOk);

    /**
     * MNGModalOkCancel
     */
    class MNGModalOkCancel extends MNGModalBase {

        callback = null;

        constructor() {
            super();
            this.confirmModal = this.confirmModal.bind(this);
            super.render();
            this.render();
        }

        setCallback(callback) {
            this.okBtn.removeEventListener("click", this.callback);
            this.callback = callback;
            this.okBtn.addEventListener("click", this.callback);
        }

        render() {
            // create bottom button wrapper
            const wrapDiv = document.createElement("div");
            wrapDiv.classList.add("row-flex");
            this.okBtn.addEventListener("click", this.callback ? this.confirmModal : this.cancelModal);
            // create cancel button
            const cancelBtn = new MNGButton();
            cancelBtn.setAttribute("caption", "Cancel");
            cancelBtn.addEventListener("click", this.cancelModal);
            wrapDiv.appendChild(cancelBtn);
            // add ok button to wrapper
            wrapDiv.appendChild(this.okBtn);
            // add wrapper to modal popup
            this.popup.appendChild(wrapDiv);
        }

        confirmModal() {
            this.cancelModal();
            if(this.callback) {
                this.callback();
            }
        }

    }

    customElements.define("mng-modalokcancel", MNGModalOkCancel);
})();
























