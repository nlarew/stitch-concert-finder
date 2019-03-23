import { Stitch } from "mongodb-stitch-browser-sdk";
import { config } from "dotenv";
config();

// Get our Stitch application ID (the APP_ID value in our .env file)
const APP_ID = process.env["APP_ID"];

// Stitch App Client Setup
if (!Stitch.hasAppClient(APP_ID)) {
  Stitch.initializeAppClient(APP_ID);
}
const app = Stitch.getAppClient(APP_ID);

export default app;
