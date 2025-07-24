import { httpRouter } from "convex/server";

const http = httpRouter();

// Add your custom HTTP routes here
// Example:
// http.route({
//   path: "/api/webhook",
//   method: "POST",
//   handler: httpAction(async (ctx, request) => {
//     // Handle webhook
//     return new Response("OK", { status: 200 });
//   }),
// });

export default http;
