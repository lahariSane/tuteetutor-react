import { invalidateCache } from "../middlewares/cacheMiddleware.js";

export const announcementCacheHelper = {
  // Invalidate all announcement-related caches
  async invalidateAllAnnouncementCaches() {
    await invalidateCache("announcements:*");
    console.log("All announcement caches invalidated");
  },

  // Invalidate specific user role announcement cache
  async invalidateRoleAnnouncementCache(role) {
    await invalidateCache(`announcements:${role}:*`);
    console.log(`Announcement cache for role ${role} invalidated`);
  },

  // Invalidate faculty courses cache for a specific user
  async invalidateFacultyCoursesCache(userId) {
    await invalidateCache(`faculty-courses:${userId}`);
    console.log(`Faculty courses cache for user ${userId} invalidated`);
  },

  // Invalidate all faculty courses caches
  async invalidateAllFacultyCoursesCaches() {
    await invalidateCache("faculty-courses:*");
    console.log("All faculty courses caches invalidated");
  },
};
