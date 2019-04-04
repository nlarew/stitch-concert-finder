import { RemoteMongoClient } from "mongodb-stitch-browser-sdk";
import app from "./app.js";
import * as R from 'ramda';

const mongoClient = app.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
const users = mongoClient.db("concertmap").collection("users");
const venues = mongoClient.db("concertmap").collection("venues");

export function getUserProfile(userId) {
  return users.findOne({ id: userId })
}

export function addFavoriteVenue({ venueId }) {
  const userId = app.auth.user.id
  return users.findOneAndUpdate(
    { id: userId },
    { $addToSet: { favoriteVenues: venueId } },
    { returnNewDocument: true }
  )
}

export function removeFavoriteVenue({ venueId }) {
  const userId = app.auth.user.id
  return users.findOneAndUpdate(
    { id: userId },
    { $pullAll: { favoriteVenues: [venueId] } },
    { returnNewDocument: true }
  )
}

export async function starEvent({ venueId, eventId }) {
  const userId = app.auth.user.id
  const venue = await venues.findOne({ id: venueId })
  const eventIndex = venue.upcomingEvents.findIndex(e => e.id === eventId)
  const event = venue.upcomingEvents[eventIndex]
  const updatedEvent = { ...event, stars: R.append(userId, event.stars) }
  const upcomingEvents = R.update(eventIndex, updatedEvent, venue.upcomingEvents)
  return await venues.findOneAndUpdate({ id: venueId }, { $set: { upcomingEvents } }, { returnNewDocument: true })
}

export async function unstarEvent({ venueId, eventId }) {
  const userId = app.auth.user.id
  const venue = await venues.findOne({ id: venueId })
  const eventIndex = venue.upcomingEvents.findIndex(e => e.id === eventId)
  const event = venue.upcomingEvents[eventIndex]
  const updatedEvent = { ...event, stars: R.without(userId, event.stars) }
  const upcomingEvents = R.update(eventIndex, updatedEvent, venue.upcomingEvents)
  return await venues.findOneAndUpdate({ id: venueId }, { $set: { upcomingEvents } }, { returnNewDocument: true })
}
