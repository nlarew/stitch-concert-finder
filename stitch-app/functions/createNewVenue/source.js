class Venue {
  constructor(eventfulVenue, upcomingEvents) {
    this.id = eventfulVenue.id;
    this.url = eventfulVenue.url;
    this.name = eventfulVenue.venue_name;
    this.description = eventfulVenue.description;
    this.upcomingEvents = upcomingEvents;
    this.location = {
      lat: eventfulVenue.latitude,
      lng: eventfulVenue.longitude,
    };
  }

  toJson() {
    const  { id, url, name, description, location } = this;
    return { id, url, name, description, location };
  }
}

exports = async function(venue_id, upcomingEvents) {
  const eventful = new (context.functions.execute("service__Eventful"))();
  const venueDetail = await eventful.getVenueDetails(id);
  const venue = new Venue(venueDetail, upcomingEvents).toJson();
  return venue
};
