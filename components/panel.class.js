'use strict';
export default class Panel {
    constructor(container){
        this.container = container;
    }

    buildPanel(data, type){
        this.container.innerHTML = (type == 'list') ? this.buildList(data) : this.buildItem(data);
    }

    clearPanel(){
        this.container.innerHTML = '';
    }

    buildItem(data){
        let html = `
            <h5>Item</h5>
        `;
        
        return html;
    }

    buildList(data){
        let html = `
            <h5>List</h5>
            <section class="response-rates">
            <div><span><strong>2010 RESPONSE RATE</strong><br>${resp2010}%</span></div>
            <div><span><strong>2020 RESPONSE RATE</strong><br>${(data2020 != undefined)? `${parseInt(data2020.properties.CRRALL)}%` : `No Data` }</span></div>
            </section>
            <section class="group">
            <span class="header">Internet</span>
            <p><strong>% of Internet Subscriptions:</strong> ${parseInt(data.properties.internet_p)}%</p>
            <p><strong>% of No Internet Access:</strong> ${parseInt(data.properties.no_access_)}%</p>
            <p><strong># of No Internet Access:</strong> ${parseInt(data.properties.no_interne)}</p>
            </section>
            <section class="group">
            <span class="header">Population</span>
            <p><strong>Househods:</strong> ${data.properties.households}</p>
            <p><strong>Housing Units:</strong> ${data.properties.housing_un}</p>
            <p><strong>Total Population:</strong> ${data.properties.total_pop_}</p>
            <p><strong>Total Population under 5:</strong> ${data.properties.pop_under_}</p>
            <p><strong>Low Response:</strong> ${parseInt(data.properties.low_respon)}%</p>
            </section>
            <section class="group">
            <span class="header">Race and Hispanic Origin</span>
            <p><strong># of Black or African American alone:</strong> ${data.properties.total_blac}</p>
            <p><strong>% of Black or African American alone:</strong> ${parseInt(data.properties.black_alon)}%</p>
            <p><strong>Hispanic Population 2010 census:</strong> ${data.properties.hispanic_c}</p>
            <p><strong>Hispanic Population 2012-2017 ACS 5 year estimate:</strong> ${data.properties.hispanic_a}</p>
            </section>
            <section class="group">
            <span class="header">Location</span>
            <p><strong>Council District:</strong> ${data.properties.council_di}</p>
            <p><strong>Hardest to Count(Mail Return Rate 2010):</strong> ${parseInt(data.properties.mrr)}%</p>
            <p><strong>Neighborhood:</strong> ${data.properties.neighborho}</p>
            <p><strong>Zip Codes:</strong> ${data.properties.zipcodes}</p>
            </section>
            <section class="group">
            <span class="header">Learn more</span>
            <article class="sub-group">
                <a class="btn resource" href="/taxonomy/term/5441" target="_blank">Get Involved</a>
            </article>
            </section>
            <p><small>Some small print and disclaimer.</small></p>
        `;
        
        return html;
    }
}