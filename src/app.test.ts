import { createApp } from "./app";
import request from "supertest";
import { Express } from "express";
import Lowdb from "lowdb";
import Memory from "lowdb/adapters/Memory";
import { DatabaseSchema } from "./DatabaseSchema";
import dbData from "./fixtures/db.json";
import { Gif } from "model/gif.model";

describe("/api/memes", () => {
  let app: Express;

  beforeEach(() => {
    const adapter = new Memory<DatabaseSchema>("");
    const db = Lowdb(adapter);

    db.defaults(dbData).write();

    app = createApp(db);
  });

  it("endpoint exists", (done) => {
    request(app).get("/api/gifs").expect(200, done);
  });

  it("returns a list", (done) => {
    request(app)
      .get("/api/gifs")
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        done();
      });
  });

  it("returns a list of 50 memes", (done) => {
    request(app)
      .get("/api/gifs")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(50);
        done();
      });
  });

  it("return a gif", (done) => {
    const gif: Gif = {
      id: "YleuWir5NTNVXkflSp",
      src: "https://media4.giphy.com/media/YleuWir5NTNVXkflSp/giphy.gif?cid=be655fb7f245f7d29df0fc743b70e3ee884dbaf31956e789&rid=giphy.gif",
      title: "Movie Brazil GIF by MOODMAN",
      tags: ["#movie", "#brazil", "#brazil the movie"],
      user: {
        avatar: "",
        name: "",
      },
    };

    request(app)
      .get("/api/gifs/YleuWir5NTNVXkflSp")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(gif);
        done();
      });
  });

  it("gif not exists", (done) => {
    request(app).get("/api/gifs/irrelevantId").expect(404, done);
  });

  it("return a gif by name", (done) => {
    const gif: Gif = {
      id: "4Zo41lhzKt6iZ8xff9",
      src: "https://media4.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif?cid=be655fb7f245f7d29df0fc743b70e3ee884dbaf31956e789&rid=giphy.gif",
      title: "White Dog GIF",
      tags: [
        "#cute",
        "#dog",
        "#adorable",
        "#wiggle",
        "#pup",
        "#ears",
        "#cute animals",
        "#dog ears",
      ],
      user: {
        avatar: "",
        name: "",
      },
    };

    request(app)
      .get("/api/gifs?title=dog")
      .expect(200)
      .then((response) => {
        expect(response.body).toContainEqual(gif);
        done();
      });
  });

  it("search has not results", (done) => {
    request(app)
      .get("/api/gifs?title=thistitledonthaveresult")
      .expect(404, done);
  });
});
