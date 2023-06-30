import { createApp } from "./app";
import request from "supertest";
import { Express } from "express";
import Lowdb from "lowdb";
import Memory from "lowdb/adapters/Memory";
import { DatabaseSchema } from "./DatabaseSchema";
import dbData from "./fixtures/db.json";

describe("/api/memes", () => {
  let app: Express;

  beforeEach(() => {
    const adapter = new Memory<DatabaseSchema>("");
    const db = Lowdb(adapter);

    db.defaults(dbData).write();

    app = createApp(db);
  });

  it("endpoint exists", (done) => {
    request(app).get("/api/memes").expect(200, done);
  });

  it("returns a list", (done) => {
    request(app)
      .get("/api/memes")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        done();
      });
  });

  it("returns a list of 50 memes", (done) => {
    request(app)
      .get("/api/memes")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(50);
        done();
      });
  });
});
