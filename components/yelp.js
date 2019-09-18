exports.yelp = function(){
    const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
    const apiKey = 'MIzyyL2O3CO86GTDo9ISK3LZWujAXdzDWKluJx96oAAJtEQg05zxVlM74TSnMi472hZJJkTp40DF8a59ALGftK8wUnJbobbW4eTNBQZu2O8fwo2-x966_plTV3SCXXYx';

    const searchRequest = {
        term:'Free Wifi',
        location: 'detroit, mi'
    };

    const client = yelp.client(apiKey);

    client.search(searchRequest).then(response => {
        const firstResult = response.jsonBody.businesses[0];
        const prettyJson = JSON.stringify(firstResult, null, 4);
        console.log(prettyJson);
    }).catch(e => {
        console.log(e);
    });
}

