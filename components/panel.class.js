'use strict';
export default class Panel {
    constructor(container){
        this.container = container;
        this.active    = false;
    }

    buildPanel(data){
        this.container.innerHTML = this.buildMarkup(data);
    }

    clearPanel(){
        this.container.innerHTML = '';
    }

    buildMarkup(data){
        let html = `
            <h5>WI-FI NEAR YOUR</h5>
             ${data.map((loc) => {
                console.log(loc);
                return `
                <section class="location">
                <input type="hidden" value="${loc.properties.ID}"></input>
                <div class="loc-img-container">
                <img src="${loc.properties.image}" rel="${loc.properties.name}"></img>
                </div>
                <p><strong>${loc.properties.name}</strong></p>
                <p>${loc.properties.address}</p>
                <p><a href="tel:${loc.properties.phone}">${loc.properties.displayPhone}</a></p>
                <p>
                ${loc.properties.categories.map((cat) => {
                    return `
                    <span><em>${cat.title}</em></span> &bull;
                    `       
                }).join("")}
                </section>
                `       
            }).join("")}
        `;
        return html;
    }
}