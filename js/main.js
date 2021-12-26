

onload = _ => {

    const accordeon = document.querySelector("#testing");

    const p = document.createElement("p");
    p.textContent = "paragraph";
    p.style.margin = 0;
    p.style.padding = ".5em";
    accordeon.addItem(p);

    const btn = document.createElement("span", {is: "mng-round-btn"});
    btn.textContent = "add";
    accordeon.addItem(btn);

    const listview = document.createElement("ul", {is: "mng-listview"});
    listview.addItem("item1");
    const div = document.createElement("div");
    div.textContent = "item2";
    listview.addItem(div);
    accordeon.addItem(listview);
}













