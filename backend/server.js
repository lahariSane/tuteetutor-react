// server.js
import app from "./app.js";
import DATABASE from "./models/db.js";
import initializationService from "./services/initializationService.js";
import redisClient from "./services/redisClient.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB first
    const db = new DATABASE();
    await db.connect();
    console.log("Connected to MongoDB");

    // Connect to Redis
    await redisClient.connect();
    console.log("Connected to Redis");

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

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");

  if (redisClient.isConnected()) {
    await redisClient.client.quit();
    console.log("Redis connection closed");
  }

  process.exit(0);
});

// Start the application
startServer();
