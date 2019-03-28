class Venue {
  constructor(eventfulVenue) {
    this.id = eventfulVenue.id;
    this.url = eventfulVenue.url;
    this.name = eventfulVenue.venue_name;
    this.description = eventfulVenue.description
    this.location = {
      lat: eventfulVenue.latitude,
      lng: eventfulVenue.longitude,
    };
  }

  toJson() {
    const  { id, url, name, description, location } = this
    return { id, url, name, description, location }
  }
}

exports = async function(changeEvent) {
  const mongodb = context.services.get("mongodb-atlas");
  const eventful = new (context.functions.execute("service__Eventful"))();
  
  const { fullDocument } = changeEvent;
  const { id, upcomingEvents } = fullDocument
  
  const venueDetail = eventful.getVenueDetails(id)
  const venue = {
    ...fullDocument,
    ...(new Venue(venueDetail)).toJson()
  }
  
  const venues = mongodb.db("concertmap").collection("venues");
  return await venues.findOneAndReplace({ "id": venue_id }, venue, {
    "returnNewDocument": true
  })
};
