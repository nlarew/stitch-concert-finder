import { useState, useEffect } from "react";
import { RemoteMongoClient } from "mongodb-stitch-browser-sdk";
import app from "./app.js";
import * as R from 'ramda';

const mongoClient = app.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
const users = mongoClient.db("concertmap").collection("users");
const venues = mongoClient.db("concertmap").collection("venues");

export function getVenuesById(venueIds) {
  return venues.find({ id: { $in: venueIds } }).toArray()
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

export async function getUserProfile(userId, iteration=0) {
  // We need to wait for the trigger to create this profile if it's a new account
  if (iteration > 20) { throw new Error("uh-oh") }
  const delay = (fn) => new Promise((resolve) => { setTimeout(() => resolve(fn()), 1000) })
  const p = await users.findOne({ id: userId });
  const userProfile = await users.findOne({ id: userId }) || await delay(() => getUserProfile(userId, iteration+1))
  return userProfile
}

export function useWatchUser(stitchUserId) {
  const [watchedUser, setWatchedUser] = useState(null);
  const isUser = !!stitchUserId;
  useEffect(() => {
    console.log("useWatchUser - effect called");
    const isWatchableUser = !!stitchUserId;
    const isWatchingUser = !!watchedUser;
    const isFirstWatchedUser = isWatchableUser && !isWatchingUser;
    const isDifferentUser =
      isWatchableUser && isWatchingUser && watchedUser.id !== stitchUserId;
    const isRemovingUser = !isWatchableUser && isWatchingUser;
    console.log(`
         isWatchableUser: ${isWatchableUser}
          isWatchingUser: ${isWatchingUser}
      isFirstWatchedUser: ${isFirstWatchedUser}
         isDifferentUser: ${isDifferentUser}
          isRemovingUser: ${isRemovingUser}
    `);
    if (isFirstWatchedUser || isDifferentUser) {
      async function openChangeStream() {
        const userProfile = await getUserProfile(stitchUserId);
        if (userProfile) {
          setWatchedUser(userProfile);
          const stream = await users.watch([userProfile._id]);
          stream.onNext(changeEvent => {
            if(changeEvent.fullDocument) {
              setWatchedUser(changeEvent.fullDocument);
            }
          });
          return stream;
        }
      }
      const getStream = openChangeStream();
      return () => {
        getStream && getStream.then(stream => {
          console.log('closing stream')
          stream.close()
        });
      };
    } else if (isRemovingUser) {
      setWatchedUser(null);
    }
  }, [stitchUserId, isUser]);
  return watchedUser;
}
