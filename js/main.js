

onload = _ => {

    const accordeon = document.querySelector("#testing");

    const p = document.createElement("p");
    p.textContent = "paragraph";
    p.style.margin = 0;
    p.style.padding = ".5em";
    accordeon.addItem(p);

    const btn = document.createElement("mng-round-btn");
    btn.setAttribute("icon", "add");
    accordeon.addItem(btn);

    customElements.define('my-paragraph', class extends HTMLElement {
        constructor() {
            super();
            let template = document.getElementById('my-paragraph');
            let templateContent = template.content;

            const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(templateContent.cloneNode(true));
        }
        });

    const listview = document.createElement("ul", {is: "mng-listview"});
    listview.addItem("item1");
    var div = document.createElement("div");
    div.textContent = "item2";
    listview.addItem(div);
    div = document.createElement("my-paragraph");
    listview.addItem(div);
    accordeon.addItem(listview);


}













