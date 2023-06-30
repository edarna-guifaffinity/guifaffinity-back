import { Request, Response, Router } from "express";
import { Gif } from "model/gif.model";

export const routes = Router();

routes.get("/memes", (req: Request, res: Response) => {
  const db = req.context.db;
  const memes = db.get("memes").take(50).value();
  memes.forEach((meme) => {
    console.log(meme?.id);
  });

  res.status(200).json(memes);
});
