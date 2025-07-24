import { defineApp } from "convex/server";

const app = defineApp();
app.use(auth, { pathPrefix: "/auth" });

export default app;
