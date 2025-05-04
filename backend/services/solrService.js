import solr from "solr-client";
import config from "../config/solr-config.js";

class SolrService {
  constructor() {
    this.announcementsClient = solr.createClient({
      host: config.host || "localhost",
      port: config.port || "8983",
      core: "announcements",
      protocol: "http",
    });

    this.todosClient = solr.createClient({
      host: config.host || "localhost",
      port: config.port || "8983",
      core: "todos",
      protocol: "http",
    });
  }

  // Index announcement document
  async indexAnnouncement(announcement) {
    try {
      const solrDoc = {
        id: announcement._id.toString(),
        title: announcement.title,
        description: announcement.description,
        author: announcement.author,
        authorId: announcement.authorId,
        courseId: announcement.course.toString(),
        date: announcement.date,
        file: announcement.file || null,
        _version_: 0,
      };

      await this.announcementsClient.add(solrDoc);
      await this.announcementsClient.commit();
      return true;
    } catch (error) {
      console.error("Error indexing announcement:", error);
      throw error;
    }
  }

  // Index todo document
  async indexTodo(todo) {
    try {
      const solrDoc = {
        id: todo._id.toString(),
        title: todo.title,
        dueDate: todo.dueDate,
        isCompleted: todo.isCompleted,
        userId: todo.userId.toString(),
        _version_: 0,
      };

      await this.todosClient.add(solrDoc);
      await this.todosClient.commit();
      return true;
    } catch (error) {
      console.error("Error indexing todo:", error);
      throw error;
    }
  }

  // Search announcements
  async searchAnnouncements(query, filters = {}) {
    try {
      const queryParams = this.announcementsClient
        .query()
        .q(query || "*:*")
        .start(filters.start || 0)
        .rows(filters.rows || 10);

      // Add filters
      if (filters.courseId) {
        queryParams.fq(`courseId:${filters.courseId}`);
      }
      if (filters.authorId) {
        queryParams.fq(`authorId:${filters.authorId}`);
      }
      if (filters.dateRange) {
        queryParams.fq(
          `date:[${filters.dateRange.start} TO ${filters.dateRange.end}]`,
        );
      }

      // Add highlighting
      queryParams.hl({
        on: true,
        fl: ["title", "description"],
        simplePre: "<em>",
        simplePost: "</em>",
      });

      const result = await this.announcementsClient.search(queryParams);
      return {
        docs: result.response.docs,
        numFound: result.response.numFound,
        highlighting: result.highlighting,
      };
    } catch (error) {
      console.error("Error searching announcements:", error);
      throw error;
    }
  }

  // Search todos
  async searchTodos(query, userId, filters = {}) {
    console.log("userId in searchTodos", userId);
    try {
      const queryParams = this.todosClient
        .query()
        .q(query || "*:*")
        .fq(`userId:${userId}`) // Always filter by user ID
        .start(typeof filters.start === "number" ? filters.start : 0)
        .rows(typeof filters.rows === "number" ? filters.rows : 10);

      // Optional filters
      if (typeof filters.isCompleted === "boolean") {
        queryParams.fq(`isCompleted:${filters.isCompleted}`);
      }

      if (typeof filters.dueDate === "string" && filters.dueDate.trim()) {
        queryParams.fq(`dueDate:[* TO ${filters.dueDate}]`);
      }

      // Highlighting
      queryParams.hl({
        on: true,
        fl: ["title"],
        simplePre: "<em>",
        simplePost: "</em>",
      });

      const result = await this.todosClient.search(queryParams);
      return {
        docs: result.response.docs,
        numFound: result.response.numFound,
        highlighting: result.highlighting,
      };
    } catch (error) {
      console.error("Error searching todos:", error);
      throw error;
    }
  }

  // Delete document
  async deleteDocument(id, core) {
    try {
      const client =
        core === "todos" ? this.todosClient : this.announcementsClient;
      await client.delete("id", id);
      await client.commit();
      return true;
    } catch (error) {
      console.error(`Error deleting document from ${core}:`, error);
      throw error;
    }
  }

  // Bulk index documents
  async bulkIndex(documents, core) {
    try {
      const client =
        core === "todos" ? this.todosClient : this.announcementsClient;
      await client.add(documents);
      await client.commit();
      return true;
    } catch (error) {
      console.error(`Error bulk indexing documents to ${core}:`, error);
      throw error;
    }
  }
}

export default new SolrService();
