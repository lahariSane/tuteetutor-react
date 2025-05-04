import app from "./app.js";
import DATABASE from "./models/db.js";
import initializationService from "./services/initializationService.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB first
    const db = new DATABASE();
    await db.connect();
    console.log("Connected to MongoDB");

    // Initialize Solr
    await initializationService.initialize();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the application
startServer();
