exports = function(authEvent) {
  const applicationUsers = context.services
    .get("mongodb-atlas")
    .db("concertmap")
    .collection("users");
    
  const { user } = authEvent;
  applicationUsers.deleteOne({ id: user.id });
};
