import http, { Server } from "http";
import { createApp } from "./app";
import Lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { DatabaseSchema } from "./DatabaseSchema";

const adapter = new FileSync<DatabaseSchema>("./data/db.json");
const db = Lowdb(adapter);

const app = createApp(db);

const port: string = process.env.PORT || "3000";

// Assigns setting name to value
// http://expressjs.com/es/api.html#app.set
app.set("port", port);

const server: Server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

interface ListeningError extends Error {
  syscall?: string;
  code?: string;
}

function onError(error: ListeningError) {
  if (error.syscall !== "listen") {
    throw error;
  }

  switch (error.code) {
    case "EACCES":
      console.error(`${port} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  console.log(`Listening on ${port}`);
}
