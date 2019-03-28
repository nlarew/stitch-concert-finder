import app from "./../app";
import nearbyEvents from "./stubs/nearbyEvents.json";
import nearbyVenues from "./stubs/nearbyVenues.json";

export function getNearbyEvents() {
  return nearbyEvents;
}

export function getNearbyVenues() {
  return nearbyVenues;
}

export function searchForUpcomingEvents(address) {
  return app.callFunction("new_searchNearAddress", [address]);
}
