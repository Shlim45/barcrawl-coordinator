const yelp = require('yelp-fusion');
const client = yelp.client(process.env.YELP_API);

exports.yelpSearch = function(category="bars", location="pittsburgh, pa") {
    return client.search({
            category,
            location,
        })
        .then(response => response.jsonBody.businesses)
        .catch(e => console.log(e));
};

module.exports = exports;