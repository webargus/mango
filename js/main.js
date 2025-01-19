
onload = _ => {

    // console.log(dateUtils.isLeapYear("2020") ? "true" : "false");
    // console.log(MNGDateUtils.isLeapYear("2021") ? "true" : "false");
    // MNGDateUtils.goPreviousMonth(new Date(2020, 2, 31));       // March 31 2020 (leap year)
    // console.log(MNGDateUtils.getDateParams());
    // MNGDateUtils.goNextMonth(new Date(2020, 0, 31));           // Jan 31 2020 (leap year)
    // console.log(MNGDateUtils.getDateParams());
    // MNGDateUtils.goPreviousMonth(new Date(2020, 0, 31));       // Jan 31 2020
    // console.log(MNGDateUtils.getDateParams());
    // MNGDateUtils.goNextMonth(new Date(2021, 11, 31))           // Dec 31 2021
    // console.log(MNGDateUtils.getDateParams());
    // console.log(MNGDateUtils.getFirstWeekDayOfMonth());
    // console.log(MNGDateUtils.getFirstWeekDayOfMonth(new Date(2022, 0, 15)));
    // console.log(MNGDateUtils.formatDate("DD/MM/YYYY", "pt-br"));
    // console.log(MNGDateUtils.formatDate("DD/MMMM/YYYY", "pt-br"));
    // console.log(MNGDateUtils.formatDate("W, DD/MMMM/YYYY", "pt-br", new Date(2022, 0, 1)));
    // console.log(MNGDateUtils.formatDate("WW, DD/MM/YYYY", "pt-br", new Date(2022, 0, 1)));
    // console.log(MNGDateUtils.getLocaleWeekDayNames("pt-br", 3));
    // console.log(MNGDateUtils.getCalendarMatrix());
    // MNGDateUtils.goNextMonth();
    // console.log(MNGDateUtils.getCalendarMatrix());
    // MNGDateUtils.goNextMonth();
    // console.log(MNGDateUtils.getCalendarMatrix());

    const accordeon = document.querySelector("#testing");

    customElements.define('my-paragraph', class extends HTMLElement {
        constructor() {
            super();
            let template = document.getElementById('my-paragraph');
            let templateContent = template.content;

            const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
        }
        });

    const listview = document.createElement("mng-listview");
    listview.addItem("item1");

    // const p = document.createElement("p");
    // p.textContent = "paragraph";
    // p.style.margin = 0;
    // p.style.padding = ".5em";
    // accordeon.addItem(p);

    const btn = document.createElement("mng-round-btn");
    accordeon.addItem(btn);

    div = document.createElement("div");
    div.textContent = "item2";
    listview.addItem(div);
    var div = document.createElement("my-paragraph");
    listview.addItem(div);
    accordeon.addItem(listview);

    const calendar = document.getElementById("calendar");
    calendar.callback = date => {
        console.log(date);
    };
    
    const modalOk = document.getElementById("modal_ok");
    // modalOk.openModal();
    modalOk.setHeader("Modal OK header test");
    modalOk.setContent("This is a test; warning messages will be displayed here...");

    const modalCallback = _ => {
        alert("Modal callback called successfuly");
    };
    const modalCancelOk = document.querySelector("mng-modalokcancel");
    modalCancelOk.setHeader("Cancel OK modal");
    modalCancelOk.setContent("This is a Cancel Ok modal. Would you like to confirm it?");
    modalCancelOk.setCallback(modalCallback);
}













