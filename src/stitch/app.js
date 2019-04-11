import { Stitch } from "mongodb-stitch-browser-sdk";

const APP_ID = "concertmap-ovesx";

if (!Stitch.hasAppClient(APP_ID)) {
  Stitch.initializeAppClient(APP_ID);
}
const app = Stitch.getAppClient(APP_ID);

export default app;
