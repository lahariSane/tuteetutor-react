import solr from "solr-client";
import solrConfig from "../config/solr-config.js";
import Announcements from "../models/announcementModel.js";
import Todo from "../models/todos.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Function to create Solr cores if they don't exist
async function createCores() {
  const adminClient = solr.createClient({
    host: solrConfig.host,
    port: solrConfig.port,
    path: "/solr/admin/cores",
    protocol: solrConfig.protocol,
  });

  for (const [coreName, coreConfig] of Object.entries(solrConfig.cores)) {
    try {
      // Check if core exists
      const response = await adminClient.get(
        "admin/cores",
        `action=STATUS&core=${coreName}`,
      );

      if (!response.status[coreName]) {
        // Create core
        await adminClient.get(
          "admin/cores",
          `action=CREATE&name=${coreName}&configSet=_default`,
        );
        console.log(`Created core: ${coreName}`);
      } else {
        console.log(`Core ${coreName} already exists`);
      }
    } catch (error) {
      console.error(`Error creating core ${coreName}:`, error);
    }
  }
}

// Function to index existing data
async function indexExistingData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Index announcements
    const announcements = await Announcements.find().lean();
    console.log(`Found ${announcements.length} announcements to index`);

    const announcementsClient = solr.createClient({
      host: solrConfig.host,
      port: solrConfig.port,
      core: "announcements",
      protocol: solrConfig.protocol,
    });

    for (const announcement of announcements) {
      const solrDoc = {
        id: announcement._id.toString(),
        title: announcement.title,
        description: announcement.description,
        author: announcement.author,
        authorId: announcement.authorId,
        courseId: announcement.course.toString(),
        date: announcement.date,
        file: announcement.file || null,
      };

      await announcementsClient.add(solrDoc);
    }

    await announcementsClient.commit();
    console.log("Announcements indexed successfully");

    // Index todos
    const todos = await Todo.find().lean();
    console.log(`Found ${todos.length} todos to index`);

    const todosClient = solr.createClient({
      host: solrConfig.host,
      port: solrConfig.port,
      core: "todos",
      protocol: solrConfig.protocol,
    });

    for (const todo of todos) {
      const solrDoc = {
        id: todo._id.toString(),
        title: todo.title,
        dueDate: todo.dueDate,
        isCompleted: todo.isCompleted,
        userId: todo.userId.toString(),
      };

      await todosClient.add(solrDoc);
    }

    await todosClient.commit();
    console.log("Todos indexed successfully");
  } catch (error) {
    console.error("Error indexing existing data:", error);
  } finally {
    await mongoose.disconnect();
  }
}

// Main function
async function main() {
  console.log("Initializing Solr...");
  await createCores();
  await indexExistingData();
  console.log("Solr initialization complete");
}

main().catch(console.error);
