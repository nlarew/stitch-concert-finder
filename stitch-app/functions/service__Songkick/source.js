if (!Object.entries) {
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    
    return resArray;
  };
}

class Songkick {
  constructor(apiKey) {
    this.base = "https://api.songkick.com/api/3.0/";
    this.apiKey = "<Songkick API Key>"; // apiKey
    this.client = context.services.get("songkick");
  }

  getRouteUrl(route) {
    const { base } = this;
    return `${base}${route}.json`;
  }

  async getVenue(venueName) {
    // Reference: https://www.songkick.com/developer/venue-search
    const route = "search/venues";
    const query = {
      query: venueName,
    };
    const venue = await this.sendRequest({ method: "post", route, query });
    return venue;
  }

  constructRequest({ method, route, query }) {
    const routeUrl = this.getRouteUrl(route);
    query.apikey = this.apiKey;
    const queryFields = Object.entries(query);
    const queryString = queryFields.map(([k, v]) => `${k}=${v}`);
    const requestUrl = `${routeUrl}?${queryString}`;
    return requestUrl;
  }

  async sendRequest({ method, body = {}, ...urlConfig }) {
    const url = this.constructRequest(urlConfig);
    const songkick_api = context.services.get('songkick');
    const result = await songkick_api.get({ url })
  }

  getUpcomingConcertsForVenue(venue) {
    // Reference: https://www.songkick.com/developer/upcoming-events-for-venue
    const url = `https://api.songkick.com/api/3.0/venues/{venue_id}/calendar.json`;
  }
}

exports = function(){
  const sk = new Songkick("apikeylol");
  return sk
};