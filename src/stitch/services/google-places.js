import app from "./../app.js";

/* TODO: Set up & Implement Google Places
 * - Need API Key: https://developers.google.com/places/web-service/get-api-key
 * - 
 * 
*/
class GooglePlaces() {
  constructor() {

  }

  getLocation = async (address) {
    const url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
    const body = {
      key: "<Google Places API Key>",
      input: "<Address to Search For>", // address
      inputtype: "textquery"
    }
    // const http = {}
    // const placeResult = await http.get(...)
    // return placeResult
    const placeResultStub = {
      geometry: {
        "location" : {
          "lat" : -33.866651,
          "lng" : 151.195827
        }
      },
      // ... other fields
    }
    return placeResultStub
  }
}
