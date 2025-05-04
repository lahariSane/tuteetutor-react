import solr from "solr-client";
import solrConfig from "../config/solr-config.js";
import Announcements from "../models/announcementModel.js";
import Todo from "../models/todos.js";

class InitializationService {
  constructor() {
    this.solrConfig = solrConfig;
  }

  async waitForSolr(maxRetries = 30, retryDelay = 2000) {
    console.log("Waiting for Solr to be ready...");
    console.log(
      `Solr config: ${process.env.SOLR_HOST || "localhost"}:${process.env.SOLR_PORT || "8983"}`,
    );

    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(
          `Attempting to connect to Solr at http://${process.env.SOLR_HOST || "localhost"}:${process.env.SOLR_PORT || "8983"}/solr/admin/cores`,
        );
        console.log(`Waiting for Solr... (${i + 1}/${maxRetries})`);

        // Use fetch to check if Solr is responding
        const response = await fetch(
          `http://${process.env.SOLR_HOST || "localhost"}:${process.env.SOLR_PORT || "8983"}/solr/admin/cores?action=STATUS`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log("✓ Solr is ready");
          return true;
        }

        throw new Error(`Response status: ${response.status}`);
      } catch (error) {
        console.log(`Error: ${error.message}`);
        if (i === maxRetries - 1) {
          throw new Error("Solr failed to start within the expected time");
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    throw new Error("Solr failed to start within the expected time");
  }

  async checkSolrCores() {
    console.log("Checking Solr cores...");

    try {
      const response = await fetch(
        `http://${this.solrConfig.host}:${this.solrConfig.port}/solr/admin/cores?action=STATUS`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to get core status: ${response.status}`);
      }

      const data = await response.json();
      const existingCores = Object.keys(data.status || {});

      // Check each core defined in the configuration
      for (const [coreName, coreConfig] of Object.entries(
        this.solrConfig.cores,
      )) {
        if (existingCores.includes(coreName)) {
          console.log(`✓ Core '${coreName}' already exists`);
        } else {
          console.log(`Creating core '${coreName}'...`);
          await this.createCore(coreName);
          console.log(`✓ Core '${coreName}' created`);
        }
      }

      console.log("✓ All Solr cores are ready");
    } catch (error) {
      console.error("Error checking/creating Solr cores:", error);
      throw error;
    }
  }

  async createCore(coreName) {
    try {
      const response = await fetch(
        `http://${this.solrConfig.host}:${this.solrConfig.port}/solr/admin/cores?action=CREATE&name=${coreName}&instanceDir=${coreName}&config=solrconfig.xml&schema=schema.xml`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create core: ${JSON.stringify(errorData)}`);
      }

      return true;
    } catch (error) {
      console.error(`Error creating core ${coreName}:`, error);
      throw error;
    }
  }

  async checkIfDataExists() {
    try {
      const announcementsClient = solr.createClient({
        host: this.solrConfig.host,
        port: this.solrConfig.port,
        core: "announcements",
        protocol: this.solrConfig.protocol,
      });

      const query = announcementsClient.query().q("*:*").rows(1);
      const result = await announcementsClient.search(query);

      return result.response.numFound > 0;
    } catch (error) {
      console.error("Error checking if data exists:", error);
      return false;
    }
  }

  async indexExistingData() {
    const dataExists = await this.checkIfDataExists();

    if (dataExists) {
      console.log("Data already exists in Solr, skipping indexing");
      return;
    }

    console.log("Indexing existing data...");

    // Index announcements
    const announcements = await Announcements.find().lean();
    if (announcements.length > 0) {
      const announcementsClient = solr.createClient({
        host: this.solrConfig.host,
        port: this.solrConfig.port,
        core: "announcements",
        protocol: this.solrConfig.protocol,
      });

      const announcementDocs = announcements.map((announcement) => ({
        id: announcement._id.toString(),
        title: announcement.title || "",
        description: announcement.description || "",
        author: announcement.author || "",
        authorId: announcement.authorId || "",
        courseId: announcement.course ? announcement.course.toString() : "",
        date: announcement.date || new Date().toISOString(),
        file: announcement.file || null,
      }));

      await announcementsClient.add(announcementDocs);
      await announcementsClient.commit();
      console.log(`Indexed ${announcements.length} announcements`);
    }

    // Index todos
    const todos = await Todo.find().lean();
    if (todos.length > 0) {
      const todosClient = solr.createClient({
        host: this.solrConfig.host,
        port: this.solrConfig.port,
        core: "todos",
        protocol: this.solrConfig.protocol,
      });

      const todoDocs = todos.map((todo) => ({
        id: todo._id.toString(),
        title: todo.title || "",
        dueDate: todo.dueDate || "",
        isCompleted: todo.isCompleted !== undefined ? todo.isCompleted : false,
        userId: todo.userId ? todo.userId.toString() : "",
      }));

      await todosClient.add(todoDocs);
      await todosClient.commit();
      console.log(`Indexed ${todos.length} todos`);
    }
  }

  async initialize() {
    try {
      await this.waitForSolr();
      await this.checkSolrCores();
      await this.indexExistingData();
      console.log("Initialization complete");
    } catch (error) {
      console.error("Initialization failed:", error);
      throw error;
    }
  }
}

export default new InitializationService();
