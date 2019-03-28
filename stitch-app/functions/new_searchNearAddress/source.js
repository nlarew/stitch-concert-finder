exports = async function(address){
  const google = new (context.functions.execute("service__Google"))();
  const eventful = new (context.functions.execute("service__Eventful"))();
  
  const location = await google.getLocationForAddress(address);
  const events = await eventful.getEventsNearLocation(getCoords(location), { limit: 80 });
  const venues = await getVenuesForEvents(events, eventful);
  
  return { location, venues, events }
};

function getCoords(location) {
  const { lat, lng } = location.geometry.location;
  return `${lat},${lng}`;
}

function getVenuesForEvents(events, eventful) {
  const mongodb = context.services.get("mongodb-atlas");
  const eventsByVenue = groupBy(events, "venue_id");
  const venue_ids = Object.keys(eventsByVenue)
  const venuePromises = venue_ids.map((venue_id) => {
    const upcomingEvents = eventsByVenue[venue_id].map(e => new Event(e).toJson())
    return eventful
      .getVenueDetails(venue_id)
      .then(venueDetail => new Venue(venueDetail, upcomingEvents).toJson())
  })
  return Promise.all(venuePromises).then(venues => {
    const venuesCollection = mongodb.db("concertmap").collection("venues");
    return venues.map(venue => venuesCollection.findOneAndUpdate(
      { id: venue.id },
      { $set: venue },
      { upsert: true, returnNewDocument: true }
    ))
  })
}

class Event {
  constructor(eventfulEvent) {
    this.id = eventfulEvent.id
    this.url = eventfulEvent.url
    this.name = eventfulEvent.title
    this.description = eventfulEvent.description
    this.location = {
      lat: eventfulEvent.latitude,
      lng: eventfulEvent.longitude,
    }
  }
  
  toJson() {
    const  { id, url, name, description, location } = this
    return { id, url, name, description, location }
  }
}

class Venue {
  constructor(eventfulVenue, upcomingEvents) {
    this.id = eventfulVenue.id;
    this.url = eventfulVenue.url;
    this.name = eventfulVenue.name;
    this.description = eventfulVenue.description;
    this.upcomingEvents = upcomingEvents;
    this.location = {
      lat: eventfulVenue.latitude,
      lng: eventfulVenue.longitude,
    };
  }

  toJson() {
    const  { id, url, name, description, upcomingEvents, location } = this;
    return { id, url, name, description, upcomingEvents, location };
  }
}

function groupBy(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};