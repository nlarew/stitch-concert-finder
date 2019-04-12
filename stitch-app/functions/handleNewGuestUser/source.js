exports = async function(authEvent) {
  const isGuest = authEvent.providers[0] === "anon-user";
  console.log('asdf', isGuest, EJSON.stringify(authEvent))
  const applicationUsers = context.services
    .get("mongodb-atlas")
    .db("concertmap")
    .collection("users");
    
  const { user } = authEvent;
  const profile = !isGuest && await applicationUsers.findOne({ id: user.id });
  
  if(!profile) {
    console.log("User does not have profile. Creating a new one...");
    applicationUsers.insertOne({ ...user, isGuest, favoriteVenues: [] });
  } else {
    console.log("User already has a profile. Linking this new identity...")
    const dataUpdates = parseUpdates(user.data)
    applicationUsers.updateOne(
      { _id: profile._id },
      {
        $addToSet: { identities: { $each: user.identities } },
        $set: dataUpdates
      }
    )
  }
};

function parseUpdates(userData) {
  const parseField = field => {
    const value = user.data[field];
    return value ? JSON.parse(`{ "${field}": "${value}" }`) : false;
  }
  return userData && Object.keys(userData)
    .map(parseField)
    .filter(v => !!v)
    .reduce((doc, update) => ({ ...doc, ...update }), {})
}
