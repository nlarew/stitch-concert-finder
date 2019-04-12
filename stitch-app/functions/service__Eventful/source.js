class EventfulResult {
  constructor(cursorType, search) {
    this.search = search;
    this.handlePage = this.getPageHandler(cursorType);
    this.initialized = false;
    this.currentPage = 1;
    this.limit = null
    this.firstResult = undefined;
    this.numPages = undefined;
    this.numResults = undefined;
    this.numResultPerPage = undefined;
  }
  
  initialize(firstPage) {
    this.firstResult = firstPage;
    this.numPages = firstPage.page_count;
    this.numResults = firstPage.total_items;
    this.numResultsPerPage = firstPage.page_size;
    this.initialized = true;
  }
  
  getPageHandler(cursorType) {
    const handlers = {
      "events/search": (page) => {
        return page ? page.events.event : null;
      },
      "venues/search": (page) => {
        return page ? page.venues.venue : null;
      },
    };
    return handlers[cursorType];
  }
  
  async firstPage() {
    if(!this.isFirst()) {
      throw new Error("Cannot call firstPage() on an already iterated cursor. Use the firstPage property instead.");
    }
    const first = await this.next();
    this.initialize(first);
    return first;
  }
  
  toArrayPromise({ limit }) {
    this.limit = limit;
    return this.firstPage().then(first => {
      const pagePromises = [];
      let hasMore = true
      while(hasMore) {
        const next = this.next()
        if (next) {
          pagePromises.push(next);
        } else {
          hasMore = false
        }
      }
      const concatPages = pages => pages.reduce(
        (results, page) => results.concat(this.handlePage(page)),
        this.handlePage(first)
      )
      const limitResults = results => limit ? results.filter((result, i) => i < limit) : results
      
      return Promise.all(pagePromises)
        .then(concatPages)
        .then(limitResults);
    });
  }
  
  isFirst() {
    return this.currentPage === 1;
  }
  
  hasNext() {
    // We no longer have a next page after we've fetched all the pages
    const isRealPage = this.currentPage <= this.numPages;
    // Always return at least one page
    const isFirst = this.isFirst();
    // If the previous page didn't go over the limit, we can get the next page
    const isUnderLimit = this.limit && (this.currentPage - 1) * this.numResultsPerPage < this.limit;
    
    const hasNext = isFirst || (isUnderLimit && isRealPage)
//     console.log(`
// hasNext() -> ${hasNext}
//   currentPage: ${this.currentPage} / ${this.numPages || "?"}
//   isRealPage: ${isRealPage}
//   isFirst: ${isFirst}
//   isUnderLimit: ${isUnderLimit}
// `)

    return hasNext
  }
  
  next() {
    if(this.hasNext()) {
      let nextPromise = this.search(this.currentPage);
      this.currentPage += 1;
      return nextPromise;
    } else {
      return null;
    }
  }
}

class Eventful {
  constructor() {
    this.base = "api.eventful.com";
    this.apiKey = context.values.get("EVENTFUL_API_KEY");
    this.httpClient = context.services.get("eventful");
  }
  
  // Interface Methods
  
  getEventsNearLocation(location, { limit }) {
    const cursor = new EventfulResult("events/search", (pageNum) => {
      return this.searchEvents(location, pageNum);
    });
    return cursor.toArrayPromise({ limit });
  }
  
  getVenuesNearLocation(location, { limit }) {
    const cursor = new EventfulResult("venues/search", (pageNum) => {
      return this.searchVenues(location, pageNum);
    });
    return cursor.toArrayPromise({ limit });
  }
  
  // API Endpoinnts
  
  searchEvents(submittedLocation, page_number=1) {
    return this.sendRequest({
      method: "get",
      route: "events/search",
      params: {
        category: ["music"],
        location: [submittedLocation],
        date: ["Next week"],
        within: [2],
        units: ["km"],
        page_size: [50],
        page_number: [page_number],
        mature: ["normal"],
      },
    })
      .then(result => EJSON.parse(result.body.text()))
      .catch(err => console.error("Error searching for events:", err));
  }
  
  getEventDetails(eventId) {
    return this.sendRequest({
      method: "get",
      route: "events/get",
      params: {
        id: [eventId],
      },
    })
      .then(result => EJSON.parse(result.body.text()))
      .catch(err => console.error(`Error getting details for event (${eventId}):`, err));
  }
  
  searchVenues(submittedLocation, page_number=1) {
    return this.sendRequest({
      method: "get",
      route: "venues/search",
      params: {
        location: [submittedLocation],
        within: [2],
        units: ["km"],
        page_size: [50],
        page_number: [page_number],
      },
    })
      .then(result => EJSON.parse(result.body.text()))
      .catch(err => console.error("Error searching for venues:", err));
  }
  
  getVenueDetails(venueId) {
    return this.sendRequest({
      method: "get",
      route: "venues/get",
      params: {
        id: [venueId],
      },
    })
      .then(result => EJSON.parse(result.body.text()))
      .catch(err => console.error(`Error getting details for venue (${venueId}):`, err));
  }
  
  // Send HTTP requests
  sendRequest({ method, body = {}, route, params }) {
    params.app_key = [this.apiKey];
    params = this.stringifyParams(params)
    const endpoint = {
      scheme: "http",
      host: this.base,
      path: `/json/${route}`,
      query: Object({ ...params }),
    };
    return this.httpClient.get({ ...endpoint }).catch(error => {
      console.error(`Error sending http request:`, error)
    })
  }
  
  stringifyParams(params) {
    return Object.keys(params).map(fieldName => {
      const paramsArray = params[fieldName]
      return { [fieldName]: paramsArray.map(String) }
    }).reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }
}

exports = function(){
  // const e = new Eventful();
  // return e.getEventsNearLocation("40.7133111,-73.9521927", { limit: 1 })
  // return e.getEventsNearLocation("40.7133111,-73.9521927", { limit: 1 })
  // const venue_id = "V0-001-002426931-6"
  // return e.getVenueDetails(venue_id)
  // return e.getVenuesNearLocation("40.7133111,-73.9521927", { limit: 1 })
  // return (new Eventful()).getAllUpcomingEvents("40.7133111,-73.9521927");
  // return (new Eventful()).searchEvents("40.7133111,-73.9521927", 2);
  return Eventful;
};