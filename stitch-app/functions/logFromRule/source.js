exports = async function(value, description=""){
  const log = {value, description}
  const logstring = `${value}\n\n${description}`
  
  const logs = context.services.get("mongodb-atlas").db("dev").collection("logs");
  
  await logs.insertOne(log)
  return false
};