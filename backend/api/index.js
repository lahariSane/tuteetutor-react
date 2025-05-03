// api/index.js
import app from '../backend/app.js';

export default function handler(req, res) {
  app(req, res); // Pass the Express app as handler
}
