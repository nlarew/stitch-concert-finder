exports = function(authEvent) {
  const applicationUsers = context.services
    .get("mongodb-atlas")
    .db("concertmap")
    .collection("users");
  
  return applicationUsers.insertOne({
    ...authEvent.user,
    favoriteVenues: []
  });
};
