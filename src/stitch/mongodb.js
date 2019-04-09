import { useState, useEffect } from "react";
import { RemoteMongoClient } from "mongodb-stitch-browser-sdk";
import app from "./app.js";
import * as R from 'ramda';

const mongoClient = app.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
const users = mongoClient.db("concertmap").collection("users");
const venues = mongoClient.db("concertmap").collection("venues");

export async function getUserProfile(userId, iteration=0) {
  // We need to wait for the trigger to create this profile if it's a new account
  if (iteration > 20) { throw new Error("fuck") }
  const delay = (fn) => new Promise((resolve) => { setTimeout(() => resolve(fn()), 1000) })
  const userProfile = await users.findOne({ id: userId }) || await delay(() => getUserProfile(userId, iteration+1))
  return userProfile
}

// export async function getUserProfile(userId) {
//   // We need to wait for the trigger to create this profile if it's a new account
//   const isLoggedIn = app.auth.isLoggedIn
//   if (!isLoggedIn) {
//     return null
//   } else {
//     console.error('getUserProfile', 'begin')
//     const user = await users.findOne({ id: userId })
//     if (user) {
//       return user
//     } else {
//       console.error('getUserProfile', 'failed')
//       const delay = (fn) => new Promise((resolve) => {
//         console.error('getUserProfile', 'retrying')
//         setTimeout(() => resolve(fn()), 1000)
//       })
//       return user || delay(() => getUserProfile(userId))
//     }
//   }
// }
// export async function getUserProfile(userId) {
//   // We need to wait for the trigger to create this profile if it's a new account
//   const doTheThing = new Promise((resolve, reject) => {
//     setTimeout(() => {

//       if(!userId) { console.error('hi'); resolve(null) }
//       console.error('getUserProfile', 'begin')
//       const userProfile = users.findOne({ id: userId }).then(user => {
//         console.error('getUserProfile', 'failed')
//         const delay = (fn) => new Promise((resolve) => {
//           console.error('getUserProfile', 'retrying')
//             setTimeout(() => resolve(fn()), 1000)
//           })
//           resolve(user || delay(getUserProfile(userId)))
//       })
//     }, 3000)
//     // return await userProfile
//   })
//   return await doTheThing()
// }

export function getVenuesById(venueIds) {
  return venues.find({ id: { $in: venueIds } }).toArray()
}

export function useWatchUser(stitchUser) {
  const [watchedUser, setWatchedUser] = useState(null);
  const isUser = !!stitchUser;
  // debugger
  useEffect(() => {
    // debugger
    console.log("useWatchUser - effect called");
    const isWatchableUser = !!stitchUser;
    const isWatchingUser = !!watchedUser;
    const isFirstWatchedUser = isWatchableUser && !isWatchingUser;
    const isDifferentUser =
      isWatchableUser && isWatchingUser && watchedUser.id !== stitchUser.id;
    const isRemovingUser = !isWatchableUser && isWatchingUser;
    console.log(`
         isWatchableUser: ${isWatchableUser}
          isWatchingUser: ${isWatchingUser}
      isFirstWatchedUser: ${isFirstWatchedUser}
         isDifferentUser: ${isDifferentUser}
          isRemovingUser: ${isRemovingUser}
    `);
    if (isFirstWatchedUser || isDifferentUser) {
      // debugger;
      console.log(`useWatchUser - effect created stream`);
      async function openChangeStream() {
        const userProfile = await getUserProfile(stitchUser.id);
        if (userProfile) {
          console.log(`useWatchUser - got userProfile`, userProfile);
          setWatchedUser(userProfile);
          const stream = await users.watch([userProfile._id]);
          stream.onNext(changeEvent => {
            console.log(`useWatchUser - next`);
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
  }, [stitchUser, isUser]);
  return watchedUser;
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
