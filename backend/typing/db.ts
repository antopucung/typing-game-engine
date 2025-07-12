import { SQLDatabase } from "encore.dev/storage/sqldb";

export const typingDB = new SQLDatabase("typing", {
  migrations: "./migrations",
});
