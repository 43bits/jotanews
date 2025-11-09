import { ENV } from "./src/config/env.js";

export default {
  schema: "./src/schema/",
  out: "./src/schema/migrations",
  dialect: "postgresql",
  dbCredentials: { url: ENV.DATABASE_URL },
};