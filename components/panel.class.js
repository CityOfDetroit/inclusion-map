'use strict';
export default class Panel {
    constructor(container){
        this.container = container;
        this.active    = false;
    }

    buildPanel(data, _controller){
        this.container.innerHTML = this.buildMarkup(data);
        let locs = document.querySelectorAll('.location');
        locs.forEach((loc)=>{
            loc.addEventListener('click',(ev)=>{
                switch (ev.target.tagName) {
                    case 'STRONG':
                        _controller.map.map.setFilter('wifi-featured', ['==', 'ID', ev.target.parentNode.parentNode.childNodes[1].value]);
                        _controller.panel.clearPanel();
                        document.querySelector('.data-panel.active').className = 'data-panel';
                        break;

                    case 'IMG':
                        _controller.map.map.setFilter('wifi-featured', ['==', 'ID', ev.target.parentNode.parentNode.childNodes[1].value]);
                        _controller.panel.clearPanel();
                        document.querySelector('.data-panel.active').className = 'data-panel';
                        break;

                    case 'P':
                        _controller.map.map.setFilter('wifi-featured', ['==', 'ID', ev.target.parentNode.childNodes[1].value]);
                        _controller.panel.clearPanel();
                        document.querySelector('.data-panel.active').className = 'data-panel';
                        break;

                    case 'DIV':
                        _controller.map.map.setFilter('wifi-featured', ['==', 'ID', ev.target.parentNode.childNodes[1].value]);
                        _controller.panel.clearPanel();
                        document.querySelector('.data-panel.active').className = 'data-panel';
                        break;
                
                    default:
                        break;
                }
            })
        })
    }

    clearPanel(){
        this.container.innerHTML = '';
    }

    buildMarkup(data){
        let html = `
            <h5>WI-FI NEAR YOUR</h5>
             ${data.map((loc) => {
                return `
                <section class="location">
                    <input type="hidden" value="${loc.properties.ID}"></input>
                    <div class="loc-img-container">
                    <img src="${loc.properties.image}" rel="${loc.properties.name}"></img>
                    </div>
                    <p><strong>${loc.properties.name}</strong></p>
                    <p>${loc.properties.address}</p>
                    <p><a href="tel:${loc.properties.phone}">${loc.properties.displayPhone}</a></p>
                    <p>${this.buildCategories(loc.properties.categories)}</p>
                </section>
                `       
            }).join("")}
        `;
        return html;
    }

    buildCategories(categories){
        if(Array.isArray(categories)){
            return `${categories.map((cat) => {
                return `
                <span><em>${cat.title}</em></span> &bull;
                `       
            }).join("")}`;
        }else{
            let cleanCat = JSON.parse(categories);
            return `${cleanCat.map((cat) => {
                return `
                <span><em>${cat.title}</em></span> &bull;
                `       
            }).join("")}`;
        }
    }
}