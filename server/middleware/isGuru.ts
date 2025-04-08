export default defineEventHandler((event) => {
  const user = event.context.user;
  // if (!user || user.role !== "guru") {
  //   throw createError({ statusCode: 403, statusMessage: "Akses khusus guru" });
  // }
});
