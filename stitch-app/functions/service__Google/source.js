class Google {
  constructor() {
    this.base = "maps.googleapis.com";
    this.httpClient = context.services.get("google");
    this.apiKey = context.values.get("GOOGLE_API_KEY");
  }
  
  getLocationForAddress(address) {
    // https://developers.google.com/maps/documentation/geocoding/intro#geocoding
    return this.sendRequest({
      method: "get",
      params: {
        address: [address]
      }
    })
      .then(result => EJSON.parse(result.body.text()).results[0])
  }
  
  getLocationForLatLng(latlng) {
    // https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding
    return this.sendRequest({
      method: "get",
      params: {
        latlng: [latlng]
      }
    });
  }
  
  // Send HTTP requests
  sendRequest({ method, body = {}, params }) {
    params.key = [this.apiKey];
    params = this.stringifyParams(params);
    const endpoint = {
      scheme: "https",
      host: this.base,
      path: `/maps/api/geocode/json`,
      query: Object({ ...params }),
    };
    return this.httpClient.get({ ...endpoint }).catch(error => {
      console.error(`Error sending http request:`, error);
    })
  }
  
  stringifyParams(params) {
    return Object.keys(params).map(fieldName => {
      const paramsArray = params[fieldName];
      return { [fieldName]: paramsArray.map(String) };
    }).reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }
}

exports = function(arg){
  return Google
};