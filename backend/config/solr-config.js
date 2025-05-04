const solrConfig = {
  host: process.env.SOLR_HOST || "localhost",
  port: process.env.SOLR_PORT || "8983",
  protocol: process.env.SOLR_PROTOCOL || "http",

  // Core configurations
  cores: {
    announcements: {
      name: "announcements",
      schema: {
        fields: [
          { name: "id", type: "string", required: true, stored: true },
          { name: "title", type: "text_general", stored: true },
          { name: "description", type: "text_general", stored: true },
          { name: "author", type: "string", stored: true },
          { name: "authorId", type: "string", stored: true },
          { name: "courseId", type: "string", stored: true },
          { name: "date", type: "pdate", stored: true },
          { name: "file", type: "string", stored: true },
        ],
      },
    },
    todos: {
      name: "todos",
      schema: {
        fields: [
          { name: "id", type: "string", required: true, stored: true },
          { name: "title", type: "text_general", stored: true },
          { name: "dueDate", type: "string", stored: true },
          { name: "isCompleted", type: "boolean", stored: true },
          { name: "userId", type: "string", stored: true },
        ],
      },
    },
  },
};

export default solrConfig;
