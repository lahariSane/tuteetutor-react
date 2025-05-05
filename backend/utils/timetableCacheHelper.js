import { invalidateCache } from "../middlewares/cacheMiddleware.js";

export const timetableCacheHelper = {
  // Invalidate all timetable-related caches
  async invalidateAllTimetableCaches() {
    await invalidateCache("timetable:*");
    await invalidateCache("all-timetables:*");
    console.log("All timetable caches invalidated");
  },

  // Invalidate user-specific timetable cache
  async invalidateUserTimetableCache(userId) {
    await invalidateCache(`timetable:user:${userId}:*`);
    console.log(`Timetable cache for user ${userId} invalidated`);
  },

  // Invalidate admin timetables cache (paginated)
  async invalidateAdminTimetableCache() {
    await invalidateCache("all-timetables:*");
    console.log("Admin timetable cache invalidated");
  },

  // Invalidate cache for specific date
  async invalidateDateSpecificCache(date) {
    const dateString =
      date instanceof Date ? date.toISOString().split("T")[0] : date;
    await invalidateCache(`timetable:*:date:${dateString}`);
    console.log(`Timetable cache for date ${dateString} invalidated`);
  },

  // Invalidate cache for specific room
  async invalidateRoomSpecificCache(roomNo) {
    await invalidateCache(`timetable:*:room:${roomNo}`);
    console.log(`Timetable cache for room ${roomNo} invalidated`);
  },

  // Invalidate cache for specific subject and section
  async invalidateCourseSpecificCache(subject, section) {
    await invalidateCache(`timetable:*:subject:${subject}:section:${section}`);
    console.log(`Timetable cache for ${subject}-${section} invalidated`);
  },
};
