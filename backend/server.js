import app from './app.js';

const PORT = process.env.PORT || 5000;
import DATABASE from "./models/db.js";


// DB
const db = new DATABASE();
db.connect();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
