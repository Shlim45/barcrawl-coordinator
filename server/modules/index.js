const yelp = require('yelp-fusion');
const client = yelp.client(process.env.YELP_API);

exports.yelpSearch = function(term="bars", location="pittsburgh, pa") {
    return client.search({
            term,
            location,
        })
        .then(response => response.jsonBody.businesses)
        .catch(e => console.log(e));
};

module.exports = exports;