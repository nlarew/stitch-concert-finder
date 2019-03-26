import app from "./app";

export async function getLocationForAddress(address) {
  return await app.callFunction("getLocationForAddress", address);
}

export async function searchNearAddress(address) {
  return await app.callFunction("searchNearAddress", address);
}
