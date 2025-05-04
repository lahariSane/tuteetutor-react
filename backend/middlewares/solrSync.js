import solrService from "../services/solrService.js";

export const syncAnnouncementToSolr = async (announcement) => {
  try {
    await solrService.indexAnnouncement(announcement);
  } catch (error) {
    console.error("Failed to sync announcement to Solr:", error);
    // Don't throw error to prevent blocking the main operation
  }
};

export const syncTodoToSolr = async (todo) => {
  try {
    await solrService.indexTodo(todo);
  } catch (error) {
    console.error("Failed to sync todo to Solr:", error);
    // Don't throw error to prevent blocking the main operation
  }
};

export const removeFromSolr = async (id, core) => {
  try {
    await solrService.deleteDocument(id, core);
  } catch (error) {
    console.error(`Failed to remove document from Solr ${core}:`, error);
    // Don't throw error to prevent blocking the main operation
  }
};
